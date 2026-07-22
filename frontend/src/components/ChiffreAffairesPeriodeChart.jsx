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

function ChiffreAffairesPeriodeChart({ chiffreAffaires }) {
  const data = {
    labels: chiffreAffaires.map((statistique) => statistique.periode),

    datasets: [
      {
        label: "Chiffre d'affaires (€)",

        data: chiffreAffaires.map(
          (statistique) => statistique.chiffre_affaires,
        ),
      },
    ],
  };

  const options = {
    responsive: true,

    scales: {
      x: {
        title: {
          display: true,
          text: "Période",
        },
      },

      y: {
        beginAtZero: true,

        title: {
          display: true,
          text: "Chiffre d'affaires (€)",
        },

        ticks: {
          callback: (value) => `${value} €`,
        },
      },
    },

    plugins: {
      legend: {
        position: "top",
      },

      title: {
        display: true,
        text: "Evolution du chiffre d'affaires",
      },

      tooltip: {
        callbacks: {
          label: (context) => {
            return `${Number(context.raw).toFixed(2)} €`;
          },
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
}

export default ChiffreAffairesPeriodeChart;
