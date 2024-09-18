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
          <div>
            <div className="flex items-center px-2">
              <div>
                <span>Opacidad: {(props.activeShape?.opacity ?? 1) * 100}%</span>
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

              <span>Borde</span>

              <div /* sx={{ flexDirection: "row", gap: 2, alignItems: "center" }} */>
                <button title="Cambiar color del borde" onClick={props.handleStrokeColorButtonClick} style={{ backgroundColor: props.strokeInputColor }}>
                  <Palette className="h-5 w-5 text-gray-600" />
                </button>
                <input
                  ref={props.strokeColorInputRef}
                  type="color"
                  value={props.strokeInputColor} //{color.stroke}
                  onChange={(event) => props.handleChangeColor(event, "stroke")}
                  style={{
                    position: "absolute",
                    width: 0,
                    height: 0,
                    opacity: 0,
                    left: 100,
                  }}
                />
                <div>
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

              <span>Interior</span>
              <div /* sx={{ flexDirection: "row", gap: 3 }} */>
                <button title="Cambiar color del interior" onClick={props.handleFillColorButtonClick} style={{ backgroundColor: props.fillInputColor }}>
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
                <div /* sx={{ flexDirection: "row", gap: 1, justifyContent: "center" }} */>
                  <button
                    /* style={{ backgroundColor: "white", border: `1px solid ${theme.palette.lightDark}` }} */
                    onClick={() => props.handleUpdateShape({ fill: "transparent" })}
                  >
                    {icons[props.activeShape.type]?.empty}
                  </button>
                  <button
                    /* style={{ backgroundColor: "white", border: `1px solid ${theme.palette.lightDark}` }} */
                    onClick={() => props.handleUpdateShape({ fill: props.fillInputColor })}
                  >
                    {icons[props.activeShape.type]?.full}
                  </button>
                </div>
              </div>

              {props.activeShape.type === "text" && (
                <>
                  <span>TEXTO</span>
                  <div>
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
