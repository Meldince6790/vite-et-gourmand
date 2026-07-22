import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

function StatistiquesChart({ statistiques }) {
  const maxCommandes = Math.max(
    ...statistiques.map((statistique) => statistique.nombre_commandes),
  );

  const data = {
    labels: statistiques.map((statistique) => statistique.nom_menu),

    datasets: [
      {
        label: "Nombre de commandes",

        data: statistiques.map((statistique) => statistique.nombre_commandes),
      },
    ],
  };

  const options = {
    responsive: true,

    scales: {
      x: {
        title: {
          display: true,
          text: "Menus",
        },
      },

      y: {
        beginAtZero: true,

        suggestedMax: maxCommandes + 2,

        ticks: {
          stepSize: 1,
        },

        title: {
          display: true,
          text: "Nombre de commandes",
        },
      },
    },

    plugins: {
      legend: {
        position: "top",
      },

      title: {
        display: true,
        text: "Comparaison des commandes par menu",
      },

      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.raw} commande(s)`;
          },
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
}

export default StatistiquesChart;
