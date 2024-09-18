import { Palette } from "lucide-react";
import React from "react";
import { SelectedMode } from "../../../../types";

export default function SelectedModeMenu({
  props,
}: {
  props: {
    type: SelectedMode;
    handleStrokeColorButtonClick: () => void;
    strokeInputRef: React.RefObject<HTMLInputElement>;
    strokeInputColor: string;
    handleChangeColor: (event: React.ChangeEvent<HTMLInputElement>, prop: string) => void /* llamar con (event, "stroke") */;
    strokeWidth: number;
    handleStrokeWidth: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
}) {
  console.log(props.type);
  return (
    <div>
      <div className="flex items-center space-x-2 px-2">
        <button title="Cambiar color" onClick={props.handleStrokeColorButtonClick} className="p-2 hover:bg-gray-100 rounded">
          <Palette className="h-5 w-5 text-gray-600" />
        </button>
        <input
          ref={props.strokeInputRef}
          type="color"
          value={props.strokeInputColor}
          onChange={(event) => props.handleChangeColor(event, "stroke")}
          style={{
            position: "absolute",
            width: 0,
            height: 0,
          }}
        />
        <div className="flex flex-col">
          <span>Grosor del trazo: {props.strokeWidth}</span>
          <input
            type="range"
            value={props.strokeWidth}
            min={1}
            max={50}
            style={{
              accentColor: "grey",
            }}
            onChange={props.handleStrokeWidth}
          />
        </div>
      </div>
    </div>
  );
}
