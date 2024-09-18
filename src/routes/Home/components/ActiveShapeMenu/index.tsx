import { Palette } from "lucide-react";
import { icons } from "../../../../utils";

export default function ActiveShapeMenu({
  props,
}: {
  props: {
    activeShape: fabric.Object | null;
    handleUpdateShape: (props: Record<string, string | number>) => void;
    handleStrokeColorButtonClick: () => void;
    handleFillColorButtonClick: () => void;
    strokeColorInputRef: React.RefObject<HTMLInputElement>;
    strokeInputColor: string;
    handleChangeColor: (event: React.ChangeEvent<HTMLInputElement>, prop: string) => void;
    fillColorInputRef: React.RefObject<HTMLInputElement>;
    fillInputColor: string;
  };
}) {
  return (
    <>
      {props.activeShape && props.activeShape.type && (
        <div /* sx={{ position: "sticky", width: "100%", top: 0, zIndex: 1 }} */>
          <div className="flex">
            <div className="flex flex-col px-2 ">
              <span>Borde</span>

              <div className="flex gap-1">
                <button onClick={props.handleStrokeColorButtonClick}>
                  <Palette className="h-5 w-5 text-gray-600" />
                </button>
                <input
                  ref={props.strokeColorInputRef}
                  type="color"
                  value={props.strokeInputColor}
                  onChange={(event) => props.handleChangeColor(event, "stroke")}
                  style={{
                    width: 0,
                    height: 0,
                    opacity: 0,
                  }}
                />
                <div className="flex flex-col">
                  <span>Grosor: {props.activeShape?.strokeWidth ?? 1}</span>
                  <input
                    type="range"
                    value={props.activeShape?.strokeWidth}
                    min={1}
                    max={50}
                    style={{
                      accentColor: "gray",
                    }}
                    onChange={(event) => props.handleUpdateShape({ strokeWidth: Number(event.target.value) })}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col px-2 border-r border-l">
              <span>Interior</span>

              <div className="flex gap-1 mt-1.5">
                <button onClick={props.handleFillColorButtonClick}>
                  <Palette className="h-5 w-5 text-gray-600" />
                </button>
                <input
                  ref={props.fillColorInputRef}
                  type="color"
                  value={props.fillInputColor} //{color.fill}
                  onChange={(event) => props.handleChangeColor(event, "fill")}
                  style={{
                    position: "absolute",
                    width: 0,
                    height: 0,
                    opacity: 0,
                    left: 100,
                  }}
                />
                <button onClick={() => props.handleUpdateShape({ fill: "transparent" })}>{icons[props.activeShape.type]?.empty}</button>
                <button onClick={() => props.handleUpdateShape({ fill: props.fillInputColor })}>{icons[props.activeShape.type]?.full}</button>
              </div>
            </div>

            {props.activeShape.type === "text" && (
              <div className="flex flex-col px-2 border-r">
                <span>Texto</span>
                <div className="flex flex-col">
                  <span>Tamaño: {(props.activeShape as fabric.Text).fontSize ?? 1}</span>
                  <input
                    type="range"
                    value={(props.activeShape as fabric.Text).fontSize}
                    min={1}
                    max={100}
                    style={{
                      accentColor: "gray",
                    }}
                    onChange={(event) => props.handleUpdateShape({ fontSize: Number(event.target.value) })}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col px-2">
              <span>Opacidad</span>
              <span>{(props.activeShape?.opacity ?? 1) * 100}%</span>
              <input
                type="range"
                value={props.activeShape?.opacity}
                step={0.1}
                min={0}
                max={1}
                style={{
                  accentColor: "gray",
                }}
                onChange={(event) => props.handleUpdateShape({ opacity: Number(event.target.value) })}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
