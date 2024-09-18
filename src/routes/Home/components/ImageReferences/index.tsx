import { Edit3 } from "lucide-react";
import * as React from "react";
import { BodyPart, ReferenceData, Shapes } from "../../../../types";
import { icons, references } from "../../../../utils";

export default function ImageReferences({
  bodyPart,
  handleData,
  handleColor,
}: {
  bodyPart: BodyPart;
  handleData: { [key in Shapes]: (fill?: boolean, angle?: number) => void };
  handleColor: React.Dispatch<React.SetStateAction<{ stroke: string; fill: string }>>;
}) {
  const [referenceData] = React.useState<ReferenceData | undefined>(references[bodyPart]);
  const [fill, setFill] = React.useState<string>("full");
  const [selectedColor, setSelectedColor] = React.useState<string>("black");

  const handleChangeFillType = (value: string) => {
    setFill(value);
  };

  const handleChangeColor = (color: string) => {
    setSelectedColor(color);
    handleColor((prevColor) => ({
      ...prevColor,
      stroke: color,
      fill: color,
    }));
  };

  return (
    <div className="flex flex-col items-center">
      <span className="text-lg font-medium">Referencias Técnicas</span>
      <div className="bg-white rounded-lg">
        {referenceData && (
          <div className="flex flex-row">
            <div className="flex flex-col pr-4 border-r">
              <div className="flex flex-col space-y-2">
                {Object.keys(referenceData.references.shapes).map((shape) => (
                  <button
                    key={shape}
                    onClick={() => (shape === "rhombus" ? handleData[shape as Shapes](fill === "full", 45) : handleData[shape as Shapes](fill === "full"))}
                    className="flex items-center space-x-2 px-4 py-2 rounded-md h-10 bg-gray-200 transition-all transform active:scale-90 hover:bg-blue-200 active:bg-blue-500"
                  >
                    {icons[shape]?.empty}
                    <span>{referenceData.references.shapes[shape as Shapes]}</span>
                  </button>
                ))}
              </div>
              <div className="flex justify-center mt-4">
                <div className="flex space-x-2">
                  {Object.keys(referenceData.references.fill).map((fillKey) => (
                    <button
                      key={fillKey}
                      value={fillKey}
                      onClick={() => handleChangeFillType(fillKey)}
                      className={`px-4 py-2 rounded-md ${fill === fillKey ? "bg-blue-300" : "bg-gray-200"}`}
                    >
                      <span className="whitespace-pre-wrap">{referenceData.references.fill[fillKey]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col pl-4">
              <div className="flex flex-col space-y-2">
                {Object.keys(referenceData.references.colors).map((colorKey) => (
                  <button
                    key={colorKey}
                    value={colorKey}
                    onClick={() => handleChangeColor(colorKey)}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium space-x-2 ${
                      selectedColor === colorKey ? "bg-blue-300" : "bg-gray-200"
                    } `}
                  >
                    <Edit3 style={{ color: colorKey }} />
                    <span>{referenceData.references.colors[colorKey]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
