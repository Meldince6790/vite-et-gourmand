const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const { createMenuService } = require("./menu.service");

describe("menuService.getMenuById", () => {
  it("retourne le détail enrichi fourni par le modèle", async () => {
    const detail = {
      menu_id: 1,
      titre: "Menu Entreprise Classique",
      plats: [
        {
          plat_id: 1,
          titre_plat: "Salade périgourdine",
          photo: null,
          allergenes: [{ allergene_id: 3, libelle: "Fruits à coque" }],
        },
      ],
    };

    const service = createMenuService({
      menuModel: {
        findById: async (id) => {
          assert.equal(id, 1);
          return detail;
        },
      },
    });

    const menu = await service.getMenuById(1);

    assert.equal(menu, detail);
    assert.equal(menu.plats[0].allergenes.length, 1);
  });

  it("rejette un menu introuvable", async () => {
    const service = createMenuService({
      menuModel: {
        findById: async () => null,
      },
    });

    await assert.rejects(
      () => service.getMenuById(999),
      (error) => {
        assert.equal(error.message, "Menu introuvable.");
        return true;
      },
    );
  });
});
