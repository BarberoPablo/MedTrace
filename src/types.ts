export type Shapes = "circle" | "rect" | "rhombus";

export type ReferenceData = {
  image: string;
  references: {
    shapes: { [key in Shapes]: string };
    fill: { [key: string]: string };
    colors: { [key: string]: string };
  };
};

export type BodyPart = "prostata" | "oreja" | "boca" | "costillas" | "pulmones" | "rodilla" | "pie";

export type SelectedMode = "select" | "stroke" | "";
