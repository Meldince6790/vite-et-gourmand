/**
 * Tests de non-régression « injection SQL » — 100 % hors ligne.
 *
 * Aucune connexion MariaDB / MongoDB n'est ouverte : `database.query` est remplacé
 * par un enregistreur (mock) qui capture le SQL et les paramètres, puis le SQL est
 * rendu avec le vrai formateur de mysql2 (mêmes options que le pool de l'application).
 *
 * Principe de preuve : on exécute chaque méthode avec une valeur bénigne puis avec
 * chaque charge hostile. Si le « squelette » du SQL rendu (littéraux chaîne retirés)
 * est identique, l'entrée n'a pas pu modifier la structure de la requête.
 */
const { describe, it, mock, after, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const mysql = require("mysql2");
const bcrypt = require("bcrypt");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-sql-injection";

const database = require("../config/database");
const authService = require("../services/auth.service");
const authController = require("../controllers/auth.controller");
const avisController = require("../controllers/avis.controller");
const CommandeRepository = require("../repositories/CommandeRepository");
const { createMenuModel } = require("../models/menu.model");
const {
  isSqlDriverError,
  toClientErrorMessage,
} = require("../utils/safeErrorMessage");

const MODELS = {
  plat: require("../models/plat.model"),
  allergene: require("../models/allergene.model"),
  horaire: require("../models/horaire.model"),
  theme: require("../models/theme.model"),
  regime: require("../models/regime.model"),
  utilisateur: require("../models/utilisateur.model"),
  avis: require("../models/avis.model"),
};

const PAYLOADS = [
  "' OR '1'='1",
  "'; DROP TABLE utilisateur; --",
  "admin'--",
  '" OR ""="',
  "1; SELECT SLEEP(5)",
  "1 OR 1=1",
  "' UNION SELECT password FROM utilisateur --",
  "\\",
  "\\'; DROP TABLE commande; --",
  "50% _ [x] `backtick`",
  "ligne1\nligne2\0nul",
];

const BENIGN = "benign";

after(async () => {
  try {
    await database.end();
  } catch {
    // pool jamais connecté : rien à fermer
  }
});

afterEach(() => {
  mock.restoreAll();
});

// ---------------------------------------------------------------------------
// Outillage
// ---------------------------------------------------------------------------

function createRecorder() {
  const calls = [];
  const emptyResult = () =>
    Object.assign([], { affectedRows: 1, insertId: 1 });

  return {
    calls,
    query: async (sql, params) => {
      calls.push({ sql, params });
      return [emptyResult(), []];
    },
  };
}

// Même configuration de formatage que le pool de l'application (config/database.js).
function render(sql, params) {
  const config = database.pool.config.connectionConfig;
  return mysql.format(sql, params, config.stringifyObjects, config.timezone);
}

// Retire les littéraux chaîne MariaDB ('...' avec échappements \ et '').
function skeleton(sql) {
  return sql
    .replace(/'(?:[^'\\]|\\[\s\S]|'')*'/g, "?")
    .replace(/\s+/g, " ")
    .trim();
}

function objectLike(value) {
  return new Proxy(
    {},
    {
      get: (_, key) => (typeof key === "symbol" ? undefined : value),
    },
  );
}

const OBJECT_PARAMS = new Set([
  "plat",
  "allergene",
  "horaire",
  "theme",
  "regime",
  "utilisateur",
  "avis",
  "menu",
  "commande",
  "annulation",
]);

function parameterNames(fn) {
  const match = fn
    .toString()
    .match(/^(?:async\s+)?[\w$]*\s*\(([\s\S]*?)\)\s*\{/);
  const raw = (match?.[1] ?? "").replace(/\{[^}]*\}\s*=\s*\{\}/g, "__OPTS__");

  return raw
    .split(",")
    .map((part) => part.split("=")[0].trim())
    .filter(Boolean);
}

function argumentsFor(fn, value) {
  return parameterNames(fn).map((name) => {
    if (name === "__OPTS__") return { statut: value };
    if (name === "connection") return undefined;
    if (OBJECT_PARAMS.has(name)) return objectLike(value);
    return value;
  });
}

async function runAndRecord(target, methodName, value, installRecorder) {
  const recorder = createRecorder();
  installRecorder(recorder);

  try {
    await target[methodName](...argumentsFor(target[methodName], value));
  } catch {
    // Une exception de logique métier n'est pas un problème ici :
    // seules les requêtes réellement émises nous intéressent.
  }

  return recorder.calls.map(({ sql, params }) => ({
    sql,
    params,
    rendered: render(sql, params),
  }));
}

function assertStructureUnchanged(label, benignCalls, hostileCalls, payload) {
  assert.equal(
    hostileCalls.length,
    benignCalls.length,
    `${label} : le nombre de requêtes dépend de l'entrée`,
  );

  // Anti-test vide : la méthode doit réellement émettre au moins une requête,
  // et, quand la valeur bénigne atteint le SQL en tant que paramètre, la charge
  // hostile doit l'atteindre aussi (sinon on ne testerait rien).
  assert.ok(benignCalls.length > 0, `${label} : aucune requête émise`);

  const paramContains = (calls, needle) =>
    calls.some(({ params }) =>
      (params ?? []).some((param) => String(param).includes(needle)),
    );

  if (paramContains(benignCalls, BENIGN)) {
    assert.ok(
      paramContains(hostileCalls, payload),
      `${label} : la charge « ${payload} » n'atteint pas les paramètres`,
    );
  }

  hostileCalls.forEach((hostile, index) => {
    const benign = benignCalls[index];

    assert.equal(
      hostile.sql,
      benign.sql,
      `${label} : le texte SQL préparé dépend de l'entrée`,
    );
    assert.equal(
      skeleton(hostile.rendered),
      skeleton(benign.rendered),
      `${label} : la structure SQL rendue change avec « ${payload} »`,
    );
    assert.ok(
      !hostile.sql.includes(payload),
      `${label} : la charge apparaît dans le SQL préparé`,
    );
  });
}

// ---------------------------------------------------------------------------
// 0. Validation de l'oracle (le détecteur détecte bien une vraie injection)
// ---------------------------------------------------------------------------

describe("oracle de détection (test du test)", () => {
  it("détecte une concaténation vulnérable", () => {
    const naive = (email) =>
      render(`SELECT * FROM utilisateur WHERE email = '${email}'`, []);

    assert.notEqual(
      skeleton(naive("' OR '1'='1")),
      skeleton(naive(BENIGN)),
      "l'oracle devrait signaler la concaténation",
    );
  });

  it("le balayage des modèles échoue sur un modèle volontairement vulnérable", async () => {
    const vulnerableModel = {
      async findByEmail(email) {
        // Anti-patron : concaténation directe de l'entrée.
        return vulnerableModel.db.query(
          `SELECT * FROM utilisateur WHERE email = '${email}'`,
        );
      },
    };

    const run = async (value) => {
      const recorder = createRecorder();
      vulnerableModel.db = recorder;
      await vulnerableModel.findByEmail(value);

      return recorder.calls.map(({ sql, params }) => ({
        sql,
        params,
        rendered: render(sql, params),
      }));
    };

    const benign = await run(BENIGN);

    const hostile = await run("' OR '1'='1");

    assert.throws(
      () =>
        assertStructureUnchanged(
          "modèle vulnérable",
          benign,
          hostile,
          "' OR '1'='1",
        ),
      assert.AssertionError,
    );
  });

  it("ne signale rien pour une requête paramétrée", () => {
    const safe = (email) =>
      render("SELECT * FROM utilisateur WHERE email = ?", [email]);

    for (const payload of PAYLOADS) {
      assert.equal(skeleton(safe(payload)), skeleton(safe(BENIGN)));
    }
  });
});

// ---------------------------------------------------------------------------
// 1. Modèles + repository : la structure SQL ne dépend jamais de l'entrée
// ---------------------------------------------------------------------------

describe("modèles MariaDB : structure SQL indépendante des entrées", () => {
  for (const [modelName, model] of Object.entries(MODELS)) {
    const methods = Object.keys(model).filter(
      (key) => typeof model[key] === "function",
    );

    for (const methodName of methods) {
      it(`${modelName}.${methodName}`, async () => {
        const install = (recorder) =>
          mock.method(database, "query", recorder.query);

        const benign = await runAndRecord(model, methodName, BENIGN, install);

        for (const payload of PAYLOADS) {
          const hostile = await runAndRecord(
            model,
            methodName,
            payload,
            install,
          );

          assertStructureUnchanged(
            `${modelName}.${methodName}`,
            benign,
            hostile,
            payload,
          );
        }
      });
    }
  }

  const menuMethods = Object.keys(createMenuModel(createRecorder())).filter(
    (key) => typeof createMenuModel(createRecorder())[key] === "function",
  );

  for (const methodName of menuMethods) {
    it(`menu.${methodName}`, async () => {
      const run = async (value) => {
        const recorder = createRecorder();
        const menuModel = createMenuModel(recorder);

        try {
          await menuModel[methodName](
            ...argumentsFor(menuModel[methodName], value),
          );
        } catch {
          // voir runAndRecord
        }

        return recorder.calls.map(({ sql, params }) => ({
          sql,
          params,
          rendered: render(sql, params),
        }));
      };

      const benign = await run(BENIGN);

      for (const payload of PAYLOADS) {
        assertStructureUnchanged(
          `menu.${methodName}`,
          benign,
          await run(payload),
          payload,
        );
      }
    });
  }

  const repositoryMethods = Object.getOwnPropertyNames(
    CommandeRepository.prototype,
  ).filter((key) => key !== "constructor");

  for (const methodName of repositoryMethods) {
    it(`CommandeRepository.${methodName}`, async () => {
      const run = async (value) => {
        const recorder = createRecorder();
        const repository = new CommandeRepository(recorder);

        try {
          await repository[methodName](
            ...argumentsFor(repository[methodName], value),
          );
        } catch {
          // voir runAndRecord
        }

        return recorder.calls.map(({ sql, params }) => ({
          sql,
          params,
          rendered: render(sql, params),
        }));
      };

      const benign = await run(BENIGN);

      for (const payload of PAYLOADS) {
        assertStructureUnchanged(
          `CommandeRepository.${methodName}`,
          benign,
          await run(payload),
          payload,
        );
      }
    });
  }
});

// ---------------------------------------------------------------------------
// 2. Constructions dynamiques connues
// ---------------------------------------------------------------------------

describe("constructions SQL dynamiques", () => {
  it("avis.update : seuls des fragments fixes sont ajoutés, jamais une clé du corps", async () => {
    const recorder = createRecorder();
    mock.method(database, "query", recorder.query);

    await MODELS.avis.update(7, {
      note: 3,
      description: "' OR 1=1 --",
      statut: "Validé",
      "statut = 'Validé', role_id": 3,
      "note = 5 --": 1,
    });

    const [{ sql, params }] = recorder.calls;

    assert.match(
      skeleton(sql),
      /^UPDATE avis SET note = \?, description = \?, statut = \? WHERE avis_id = \?$/,
    );
    assert.ok(!sql.includes("role_id"));
    assert.deepEqual(params, [3, "' OR 1=1 --", "Validé", 7]);
  });

  it("avis.getAll / getById : le filtre de statut reste un paramètre", async () => {
    for (const payload of PAYLOADS) {
      const recorder = createRecorder();
      mock.method(database, "query", recorder.query);

      await MODELS.avis.getAll({ statut: payload });
      await MODELS.avis.getById(payload, { statut: payload });

      for (const { sql, params } of recorder.calls) {
        assert.ok(!sql.includes(payload));
        assert.ok(params.includes(payload));
        assert.match(sql, /avis\.statut = \?/);
      }

      mock.restoreAll();
    }
  });

  it("menu.findById : la liste IN (...) est faite de ? et suit le nombre de plats", async () => {
    for (const payload of PAYLOADS) {
      const calls = [];
      const menuModel = createMenuModel({
        query: async (sql, params) => {
          calls.push({ sql, params });

          if (/FROM menu\b[\s\S]*WHERE menu\.menu_id/.test(sql)) {
            return [[{ menu_id: 1, titre: payload }], []];
          }

          if (/FROM menu_plat[\s\S]*WHERE menu_plat\.menu_id/.test(sql)) {
            // valeurs « empoisonnées » côté base (second ordre)
            return [[{ plat_id: payload }, { plat_id: 2 }, { plat_id: 3 }], []];
          }

          return [[], []];
        },
      });

      await menuModel.findById(1);

      const inListCalls = calls.filter(({ sql }) => /IN \(/i.test(sql));
      assert.ok(inListCalls.length > 0, "aucune requête IN (...) observée");

      for (const { sql, params } of inListCalls) {
        const placeholders = (sql.match(/IN \(([^)]*)\)/i)?.[1] ?? "")
          .split(",")
          .map((token) => token.trim());

        assert.ok(placeholders.every((token) => token === "?"));
        assert.equal(placeholders.length, 3);
        assert.ok(!sql.includes(payload));
        assert.ok(params.includes(payload));
      }
    }
  });

  it("aucune interpolation ${...} nouvelle dans le SQL (garde-fou de revue)", () => {
    const ALLOWED = new Map([
      [
        "src/models/avis.model.js",
        new Set(["whereClause", "statutClause", 'fields.join(", ")']),
      ],
      ["src/models/menu.model.js", new Set(["placeholders"])],
    ]);

    const backendRoot = path.join(__dirname, "..", "..");
    const roots = ["src", "scripts"];
    const offenders = [];

    const walk = (dir) =>
      fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);

        if (entry.isDirectory()) return walk(full);
        if (!entry.name.endsWith(".js") || entry.name.endsWith(".test.js")) {
          return [];
        }

        return [full];
      });

    for (const root of roots) {
      const rootPath = path.join(backendRoot, root);

      if (!fs.existsSync(rootPath)) continue;

      for (const file of walk(rootPath)) {
        const source = fs.readFileSync(file, "utf8");
        const relative = path
          .relative(backendRoot, file)
          .split(path.sep)
          .join("/");

        for (const [, body] of source.matchAll(/`([^`]*)`/g)) {
          if (
            !body.includes("${") ||
            !/\b(SELECT|INSERT\s+INTO|UPDATE|DELETE\s+FROM|FROM|WHERE)\b/.test(
              body,
            )
          ) {
            continue;
          }

          for (const [, expression] of body.matchAll(/\$\{([^}]*)\}/g)) {
            if (!ALLOWED.get(relative)?.has(expression.trim())) {
              offenders.push(`${relative} : \${${expression.trim()}}`);
            }
          }
        }
      }
    }

    assert.deepEqual(
      offenders,
      [],
      "Nouvelle interpolation dans un gabarit SQL : à valider (liste blanche ALLOWED)",
    );
  });
});

// ---------------------------------------------------------------------------
// 3. Types inattendus (JSON : objets, tableaux) via le vrai formateur mysql2
// ---------------------------------------------------------------------------

describe("types non scalaires fournis via le corps JSON", () => {
  it("la configuration du pool n'active ni multi-instructions ni placeholders nommés", () => {
    const config = database.pool.config.connectionConfig;

    assert.ok(!config.multipleStatements);
    assert.ok(!config.namedPlaceholders);
  });

  it("un objet JSON est neutralisé en littéral (pas d'expansion `col = val`)", () => {
    const rendered = render("SELECT * FROM utilisateur WHERE email = ?", [
      { email: 1, password: "x" },
    ]);

    assert.equal(
      skeleton(rendered),
      "SELECT * FROM utilisateur WHERE email = ?",
    );
  });

  it("un tableau JSON ne produit au plus qu'une liste de littéraux échappés (erreur de syntaxe, pas d'injection)", () => {
    const rendered = render("SELECT * FROM avis WHERE statut = ?", [
      ["' OR 1=1 --", "b"],
    ]);

    assert.equal(skeleton(rendered), "SELECT * FROM avis WHERE statut = ?, ?");
    assert.ok(!/\bOR\b/.test(skeleton(rendered)));
  });
});

// ---------------------------------------------------------------------------
// 4. Authentification : pas de contournement
// ---------------------------------------------------------------------------

describe("authentification : pas de contournement par injection", () => {
  const VALID_EMAIL = "admin@vite-gourmand.fr";
  const VALID_PASSWORD = "Mot-de-passe-Valide-1!";
  let adminRow;

  const installSqlSemantics = () => {
    // Émule la sémantique SQL d'une requête paramétrée : égalité stricte sur la valeur.
    const seen = [];

    mock.method(database, "query", async (sql, params) => {
      seen.push({ sql, params });

      // On évalue le SQL réellement rendu (et non la valeur brute) : une ligne n'est
      // renvoyée que si le littéral généré est exactement l'email de l'admin.
      const rendered = render(sql, params);

      return [
        skeleton(rendered) === "SELECT * FROM utilisateur WHERE email = ?" &&
        rendered.endsWith(`email = '${VALID_EMAIL}'`)
          ? [adminRow]
          : [],
        [],
      ];
    });

    return seen;
  };

  const setup = async () => {
    adminRow = {
      utilisateur_id: 1,
      email: VALID_EMAIL,
      password: await bcrypt.hash(VALID_PASSWORD, 4),
      nom: "Admin",
      prenom: "Root",
      role_id: 3,
      actif: 1,
    };
  };

  it("témoin : les bons identifiants fonctionnent", async () => {
    await setup();
    installSqlSemantics();

    const result = await authService.login(VALID_EMAIL, VALID_PASSWORD);

    assert.ok(result.token);
  });

  it("aucune charge ne permet de se connecter (email ou mot de passe)", async () => {
    await setup();
    const seen = installSqlSemantics();

    for (const payload of PAYLOADS) {
      await assert.rejects(
        authService.login(payload, payload),
        /Identifiants incorrects\./,
      );
      await assert.rejects(
        authService.login(payload, VALID_PASSWORD),
        /Identifiants incorrects\./,
      );
      await assert.rejects(
        authService.login(VALID_EMAIL, payload),
        /Identifiants incorrects\./,
      );
    }

    // `admin'--` ne doit pas être interprété comme l'identifiant `admin`
    await assert.rejects(
      authService.login("admin@vite-gourmand.fr'--", "x"),
      /Identifiants incorrects\./,
    );

    for (const { sql } of seen) {
      assert.equal(sql, "SELECT * FROM utilisateur WHERE email = ?");
    }
  });

  it("types inattendus : jamais de jeton, réponse HTTP générique", async () => {
    await setup();
    installSqlSemantics();

    const hostileBodies = [
      { email: { $ne: null }, password: { $ne: null } },
      { email: [VALID_EMAIL], password: [VALID_PASSWORD] },
      { email: { email: VALID_EMAIL }, password: VALID_PASSWORD },
      { email: VALID_EMAIL, password: { password: VALID_PASSWORD } },
      { email: null, password: null },
      { email: 1, password: 1 },
      {},
    ];

    for (const body of hostileBodies) {
      const res = createFakeResponse();

      await authController.login({ body }, res);

      assert.ok(
        res.statusCode === 401 || res.statusCode === 500,
        `statut inattendu ${res.statusCode} pour ${JSON.stringify(body)}`,
      );
      assert.ok(!res.body?.token, "un jeton a été délivré");
      assert.ok(
        ["Identifiants incorrects.", "Erreur interne du serveur."].includes(
          res.body.message,
        ),
        `message inattendu : ${res.body.message}`,
      );
    }
  });
});

// ---------------------------------------------------------------------------
// 5. Pas d'accès inter-utilisateurs par manipulation d'identifiants
// ---------------------------------------------------------------------------

describe("commandes : isolation entre clients", () => {
  const { CommandeService } = require("../services/commande.service");

  const createService = (rows) => {
    const recorder = createRecorder();
    recorder.query = async (sql, params) => {
      recorder.calls.push({ sql, params });
      return [rows, []];
    };

    return {
      recorder,
      service: new CommandeService({
        commandeRepository: new CommandeRepository(recorder),
        logger: { error() {}, warn() {}, info() {}, log() {} },
      }),
    };
  };

  it("un client ne lit pas la commande d'un autre, même avec un id hostile", async () => {
    const autreClient = { commande_id: 1, utilisateur_id: 2 };
    const { service, recorder } = createService([autreClient]);
    const client1 = { role_id: 1, utilisateur_id: 1 };

    for (const id of ["1", "1 OR 1=1", "1; DROP TABLE commande", ...PAYLOADS]) {
      await assert.rejects(
        service.getCommandeById(id, client1),
        /Commande introuvable\./,
      );
    }

    for (const { sql } of recorder.calls) {
      assert.match(sql, /WHERE commande_id = \?/);
    }
  });

  it("le client propriétaire et le personnel conservent l'accès", async () => {
    const { service } = createService([{ commande_id: 1, utilisateur_id: 2 }]);

    assert.ok(
      await service.getCommandeById("1", { role_id: 1, utilisateur_id: 2 }),
    );
    assert.ok(await service.getCommandeById("1", { role_id: 2 }));
    assert.ok(await service.getCommandeById("1", { role_id: 3 }));
  });

  it("l'identité du créateur vient du jeton, pas du corps (avis)", async () => {
    let received;
    const avisService = require("../services/avis.service");
    mock.method(avisService, "create", async (data) => {
      received = data;
      return 1;
    });

    const res = createFakeResponse();

    await avisController.create(
      {
        body: { note: 5, description: "ok", utilisateur_id: 999 },
        user: { utilisateur_id: 1 },
      },
      res,
    );

    assert.equal(received.utilisateur_id, 1);
  });
});

// ---------------------------------------------------------------------------
// 6. Fuite d'erreurs SQL vers le client
// ---------------------------------------------------------------------------

function createFakeResponse() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

describe("erreurs SQL : aucune fuite vers le client", () => {
  const sqlError = (message) =>
    Object.assign(new Error(message), {
      code: "ER_PARSE_ERROR",
      errno: 1064,
      sqlState: "42000",
      sqlMessage: message,
    });

  it("erreurs avec code ER_ déjà reconnues par le masque (témoin)", () => {
    assert.equal(
      toClientErrorMessage(
        sqlError("Duplicate entry 'a@b.c' for key 'email'"),
        "Erreur générique.",
      ),
      "Erreur générique.",
    );
  });

  // C1 (corrigé) : ces messages MariaDB n'étaient pas reconnus par l'ancienne
  // liste noire de motifs et étaient renvoyés tels quels au client. La détection
  // est désormais structurelle (sqlState / sqlMessage / code ER_*).
  const LEAKING_MESSAGES = [
    "You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near 'WHERE avis_id = '1'' at line 1",
    "Data too long for column 'adresse_livraison' at row 1",
    "Cannot add or update a child row: a foreign key constraint fails (`vite_gourmand`.`commande`, CONSTRAINT `fk_commande_menu` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`menu_id`))",
    "Operand should contain 1 column(s)",
    "Table 'vite_gourmand.avis' doesn't exist",
  ];

  for (const message of LEAKING_MESSAGES) {
    it(
      `masque l'erreur MariaDB : ${message.slice(0, 50)}…`,
      () => {
        assert.equal(
          toClientErrorMessage(sqlError(message), "Erreur générique."),
          "Erreur générique.",
        );
      },
    );
  }

  it("détecte une erreur SQL même si son message semble anodin", () => {
    for (const properties of [
      { sqlState: "42000" },
      { sqlMessage: "Operand should contain 1 column(s)" },
      { code: "ER_OPERAND_COLUMNS" },
      { code: "WARN_DATA_TRUNCATED" },
      { code: "PROTOCOL_CONNECTION_LOST" },
    ]) {
      const error = Object.assign(new Error("Quelque chose d'anodin"), properties);

      assert.equal(isSqlDriverError(error), true);
      assert.equal(toClientErrorMessage(error, "Erreur générique."), "Erreur générique.");
    }
  });

  it("conserve les erreurs métier (sans propriété du pilote SQL)", () => {
    for (const message of [
      "Avis introuvable.",
      "Statut d'avis invalide.",
      "Aucune donnée modifiable n'a été fournie.",
      "Le commentaire doit être un texte.",
      "Cette adresse e-mail est déjà utilisée.",
      "Impossible de déposer un avis : aucune commande terminée trouvée.",
    ]) {
      assert.equal(isSqlDriverError(new Error(message)), false);
      assert.equal(
        toClientErrorMessage(new Error(message), "Erreur générique."),
        message,
      );
    }
  });

  it("ne dépend pas de la forme de l'erreur reçue (null, chaîne, objet)", () => {
    for (const value of [null, undefined, "boom", {}, 42]) {
      assert.equal(toClientErrorMessage(value, "Erreur générique."), "Erreur générique.");
    }
  });

  it("un contrôleur ne renvoie jamais le texte MariaDB (400, message générique)", async () => {
    const avisService = require("../services/avis.service");

    for (const message of LEAKING_MESSAGES) {
      mock.method(avisService, "update", async () => {
        throw sqlError(message);
      });

      const res = createFakeResponse();

      await avisController.update({ params: { id: "1" }, body: { note: 4 } }, res);

      assert.equal(res.statusCode, 400);
      assert.equal(res.body.message, "Erreur lors de la modification de l'avis.");
      assert.ok(!JSON.stringify(res.body).includes("MariaDB"));
      assert.ok(!JSON.stringify(res.body).includes("vite_gourmand"));

      mock.restoreAll();
    }
  });
});

// ---------------------------------------------------------------------------
// 7. PUT /api/avis/:id : plus de SQL invalide
// ---------------------------------------------------------------------------

describe("avis.update : corps sans champ modifiable", () => {
  const EMPTY_BODIES = [{}, [], null, undefined, "texte", 42, { inconnu: "x" }, { "note = 5 --": 1 }];

  it("le contrôleur répond 400 clair et n'exécute aucune requête SQL", async () => {
    for (const body of EMPTY_BODIES) {
      const recorder = createRecorder();
      mock.method(database, "query", recorder.query);

      const res = createFakeResponse();

      await avisController.update({ params: { id: "1" }, body }, res);

      assert.equal(res.statusCode, 400, `corps ${JSON.stringify(body)}`);
      assert.equal(res.body.message, "Aucune donnée modifiable n'a été fournie.");
      assert.equal(recorder.calls.length, 0, "une requête SQL a été exécutée");

      mock.restoreAll();
    }
  });

  it("le modèle refuse lui aussi de construire un UPDATE vide", async () => {
    const recorder = createRecorder();
    mock.method(database, "query", recorder.query);

    await assert.rejects(MODELS.avis.update(1, {}), /Aucune donnée modifiable/);
    await assert.rejects(
      MODELS.avis.update(1, { "statut = 'Validé' --": 1 }),
      /Aucune donnée modifiable/,
    );

    assert.equal(recorder.calls.length, 0);
  });

  it("une mise à jour valide continue d'émettre le même UPDATE paramétré", async () => {
    const recorder = createRecorder();
    mock.method(database, "query", recorder.query);

    const res = createFakeResponse();

    await avisController.update(
      { params: { id: "7" }, body: { note: 4, description: "Très bien", statut: "Validé" } },
      res,
    );

    assert.equal(res.statusCode, 200);
    assert.equal(recorder.calls.length, 1);
    assert.equal(
      skeleton(recorder.calls[0].sql),
      "UPDATE avis SET note = ?, description = ?, statut = ? WHERE avis_id = ?",
    );
    assert.deepEqual(recorder.calls[0].params, [4, "Très bien", "Validé", "7"]);
  });
});
