import { Circle, PaintBucket, Square, X } from "lucide-react";
import glandulaTiroides from "./assets/glandulaTiroides.png";
import mamas from "./assets/mamas.png";
import niidea from "./assets/niidea.png";
import prostata from "./assets/prostata.png";
import pulmones from "./assets/pulmones.png";
import { BodyPart, BodypartOption, ReferenceData } from "./types";

export const icons: { [key: string]: { full: JSX.Element; empty: JSX.Element } } = {
  rect: {
    full: <Square className="h-5 w-5 fill-current text-gray-600" />,
    empty: <Square className="h-5 w-5 text-gray-600" />,
  },
  circle: {
    full: <Circle className="h-5 w-5 fill-current text-gray-600" />,
    empty: <Circle className="h-5 w-5 text-gray-600" />,
  },
  path: {
    full: <PaintBucket className="h-5 w-5 text-gray-600" />,
    empty: <X className="h-5 w-5 text-gray-600" />,
  },
  text: {
    full: <PaintBucket className="h-5 w-5 text-gray-600" />,
    empty: <X className="h-5 w-5 text-gray-600" />,
  },
  rhombus: {
    full: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
        <path
          fill="rgb(56,56,56)"
          d="M12 2c-.5 0-1 .19-1.41.59l-8 8c-.79.78-.79 2.04 0 2.82l8 8c.78.79 2.04.79 2.82 0l8-8c.79-.78.79-2.04 0-2.82l-8-8C13 2.19 12.5 2 12 2"
        />
      </svg>
    ),
    empty: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
        <path
          fill="rgb(56,56,56)"
          d="M12 2c-.5 0-1 .19-1.41.59l-8 8c-.79.78-.79 2.04 0 2.82l8 8c.78.79 2.04.79 2.82 0l8-8c.79-.78.79-2.04 0-2.82l-8-8C13 2.19 12.5 2 12 2m0 2l8 8l-8 8l-8-8Z"
        />
      </svg>
    ),
  },
};

export const references: { [key in BodyPart]?: ReferenceData } = {
  prostata: {
    image: prostata,
    references: {
      shapes: {
        circle: "Nódulo dérmico",
        rect: "Colección",
        rhombus: "Lesión cicatrizal",
        //triangle: "Sinus" ?
      },
      fill: {
        full: "Activa\n(relleno)",
        empty: "Inactiva\n(vacío)",
      },
      colors: {
        black: "Fístula",
        orange: "Dérmica",
        grey: "Dermoepidérmica",
        red: "Dermohipodérmica",
        "#44BCA1": "Hipodérmica",
        "#274989": "Compleja",
      },
    },
  },
};

/* To avoid cors I will download the images to the project, otherwise ExportToPNG won't work */
export const bodyParts: { title: string; options: BodypartOption[] }[] = [
  {
    title: "Cuello",
    options: [
      { name: "Glandula Tiroides", image: glandulaTiroides },
      { name: "Cuello ?", image: niidea },
    ],
  },
  {
    title: "Tórax",
    options: [
      { name: "Mamas", image: mamas },
      { name: "Pulmones", image: pulmones },
    ],
  },
  {
    title: "Piernas",
    options: [
      { name: "Rodilla", image: "" },
      { name: "Pie", image: "" },
    ],
  },
];
