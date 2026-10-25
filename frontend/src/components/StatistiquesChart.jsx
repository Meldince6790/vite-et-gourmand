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

import {
  borderColorsForCount,
  colorsForCount,
  hoverColorsForCount,
} from "./chartPalette.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

function StatistiquesChart({ statistiques }) {
  const maxCommandes =
    statistiques.length > 0
      ? Math.max(
          ...statistiques.map((statistique) => statistique.total_commandes),
        )
      : 0;

  const barCount = statistiques.length;

  const data = {
    labels: statistiques.map((statistique) => statistique.menu),

    datasets: [
      {
        label: "Nombre de commandes",
        data: statistiques.map((statistique) => statistique.total_commandes),
        backgroundColor: colorsForCount(barCount),
        hoverBackgroundColor: hoverColorsForCount(barCount),
        borderColor: borderColorsForCount(barCount),
        borderWidth: 1,
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
