import { ChevronDownIcon, DownloadIcon, PencilIcon, RedoIcon, TrashIcon, TypeIcon, UndoIcon, ZoomOutIcon, Palette } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { bodyParts } from "../../utils";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import prostata from "../../assets/prostata.png";

const initialColor = "#000";

export default function MedicalImageEditor() {
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);
  const { editor, onReady } = useFabricJSEditor();
  const strokeColorInputRef = useRef<HTMLInputElement>(null);
  const fillColorInputRef = useRef<HTMLInputElement>(null);
  const [color, setColor] = useState({
    stroke: initialColor,
    fill: "black",
  });
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [lastCoords, setLastCoords] = useState({ x: 200, y: 200 });
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isCanvasReady, setIsCanvasReady] = useState<boolean>(false);
  const [selectedMode, setSelectedMode] = useState<string>("select");
  const [activeShape, setActiveShape] = useState<fabric.Object | null>(null);

  useEffect(() => {
    if (editor?.canvas) {
      const img = new Image();
      img.src = prostata;
      img.onload = function () {
        editor.canvas.setWidth(img.width);
        editor.canvas.setHeight(img.height);
        editor.canvas.setBackgroundImage(prostata, editor.canvas.renderAll.bind(editor.canvas));
        editor.canvas.freeDrawingBrush.color = initialColor;
        setIsCanvasReady(true);
      };
    }
  }, [editor]);

  useEffect(() => {
    if (isCanvasReady) {
      if (editor) {
        const initialCanvasState = editor.canvas.toJSON();
        setHistory([initialCanvasState]);
        setHistoryIndex((prevState) => prevState + 1);
      }
    }
  }, [editor, isCanvasReady]);

  const saveHistory = useCallback(() => {
    if (editor) {
      const json = editor.canvas.toJSON();
      if (json) {
        setHistory((prevHistory) => {
          const newHistory = prevHistory.slice(0, historyIndex + 1);
          newHistory.push(json);
          return newHistory;
        });

        setHistoryIndex((prevIndex) => prevIndex + 1);
      }
    }
  }, [editor, historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      editor?.canvas.loadFromJSON(history[historyIndex - 1], () => {
        editor?.canvas.renderAll();
        setHistoryIndex((prevIndex) => prevIndex - 1);
      });
    }
  }, [editor?.canvas, history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      editor?.canvas.loadFromJSON(history[historyIndex + 1], () => {
        editor?.canvas.renderAll();
        setHistoryIndex((prevIndex) => prevIndex + 1);
      });
    }
  }, [editor?.canvas, history, historyIndex]);

  const getLastObject = () => {
    if (editor) {
      const canvas = editor.canvas;
      const objects = canvas.getObjects();

      if (objects.length > 0) {
        const lastObject = objects[objects.length - 1];
        return lastObject;
      }
    }

    return null;
  };

  const handleAddRectangle = (fill?: boolean, angle?: number) => {
    if (editor) {
      editor.addRectangle();
      editor.canvas.isDrawingMode = false;
      const lastObjectInCanvas = getLastObject();

      if (lastObjectInCanvas) {
        const size = 50;
        lastObjectInCanvas.set({
          width: size,
          height: size,
          fill: fill ? color.fill : "transparent",
          left: lastCoords.x - size / 2,
          top: lastCoords.y - size / 2,
          angle: angle ?? 0,
          stroke: color.stroke,
          strokeWidth: strokeWidth,
        });
      }
      editor.canvas.setActiveObject(lastObjectInCanvas);
      lastObjectInCanvas.setCoords();
      saveHistory();
    }
  };

  const handleAddCircle = (fill?: boolean) => {
    if (editor) {
      editor.addCircle();
      editor.canvas.isDrawingMode = false;
      const lastObjectInCanvas = getLastObject();

      if (lastObjectInCanvas) {
        const diameter = 50;
        lastObjectInCanvas.set({
          radius: diameter / 2,
          width: diameter,
          height: diameter,
          fill: fill ? color.fill : "transparent",
          left: lastCoords.x - diameter / 2,
          top: lastCoords.y - diameter / 2,
          stroke: color.stroke,
          strokeWidth: strokeWidth,
        });
      }
      editor.canvas.setActiveObject(lastObjectInCanvas);
      lastObjectInCanvas.setCoords();
      saveHistory();
    }
  };

  const handleStrokeColorButtonClick = () => {
    strokeColorInputRef.current?.click();
  };

  const handleFillColorButtonClick = () => {
    fillColorInputRef.current?.click();
  };

  const handleChangeColor = (event: React.ChangeEvent<HTMLInputElement>, prop: string) => {
    const newColor = event.target.value;
    setColor((prevState) => ({
      ...prevState,
      [prop]: newColor,
    }));

    if (editor) {
      editor.canvas.freeDrawingBrush.color = newColor;
      const selectedObject = editor.canvas.getActiveObject();

      if (selectedObject) {
        selectedObject.set(prop, newColor);
        editor.canvas.renderAll();
      }
    }
  };

  const toggleDraw = () => {
    if (editor) {
      setActiveShape(null);
      setSelectedMode((prevState) => (prevState !== "stroke" ? "stroke" : "select"));
      editor.canvas.isDrawingMode = selectedMode !== "stroke" ? true : false;
      editor.canvas.discardActiveObject();
      editor.canvas.requestRenderAll();
    }
  };

  const handleZoomOut = () => {
    if (editor) {
      const canvas = editor.canvas;
      canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
      canvas.renderAll();
    }
  };

  const handleDeleteSelected = useCallback(() => {
    if (editor) {
      const activeSelection = editor.canvas.getActiveObject();
      if (activeSelection) {
        editor?.deleteSelected();
        saveHistory();
      }
    }
  }, [editor, saveHistory]);

  const handleExportPNG = () => {
    handleZoomOut();
    if (editor) {
      const canvas = editor.canvas;
      if (canvas) {
        const dataURL = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "canvas.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const handleStrokeWidth = (event: React.ChangeEvent<HTMLInputElement>) => {
    const strokeW = Number(event.target.value);
    setStrokeWidth(strokeW);
    if (editor) {
      editor.canvas.freeDrawingBrush.width = strokeW;
    }
  };

  const handleUpdateShape = (props: Record<string, string | number>) => {
    //The reference to the activeShape is beeing modified, not the actual value
    if (activeShape) {
      activeShape.set({
        ...props,
      });
      editor?.canvas.renderAll();
      saveHistory();
    }
  };

  const handleAddText = () => {
    setSelectedMode("");
    if (editor && editor.canvas) {
      editor.addText("Escribe aquí");
      editor.canvas.isDrawingMode = false;
      const lastObjectInCanvas = getLastObject();

      if (lastObjectInCanvas) {
        lastObjectInCanvas.set({
          fontSize: 30,
          left: lastCoords.x,
          top: lastCoords.y,
          //stroke: color.stroke,
          //strokeWidth: strokeWidth,
        });
      }
      editor.canvas.setActiveObject(lastObjectInCanvas);
      lastObjectInCanvas.setCoords();
      saveHistory();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "z") {
        handleUndo();
      }
      if (event.ctrlKey && event.key === "y") {
        handleRedo();
      }
      if (event.key === "Delete") {
        handleDeleteSelected();
      }
      if (event.key === "Escape") {
        setActiveShape(null);
        setSelectedMode("select");
        if (editor) {
          editor.canvas.isDrawingMode = false;
          editor.canvas.discardActiveObject();
          editor.canvas.requestRenderAll();
        }
      }
    };

    const onPathCreated = () => {
      if (editor && editor.canvas.isDrawingMode) {
        saveHistory();
      }
    };

    const handleObjectModified = () => {
      saveHistory();
    };

    const handleObjectSelected = () => {
      const canvasObject = editor?.canvas.getActiveObject();
      if (["rect", "circle", "path", "text"].includes(canvasObject?.type)) {
        setActiveShape(canvasObject);
      }
    };

    const handleObjectCleared = () => {
      setActiveShape(null);
    };

    const handleCanvasZoom = (event: fabric.IEvent<WheelEvent>) => {
      if (editor) {
        let zoom = editor.canvas.getZoom();
        const delta = event.e.deltaY;
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;

        const offsetX = event.e.offsetX;
        const offsetY = event.e.offsetY;
        editor.canvas.zoomToPoint({ x: offsetX, y: offsetY }, zoom);

        const pointer = editor.canvas.getPointer(event.e);
        const x = pointer.x;
        const y = pointer.y;
        setLastCoords({ x, y });

        event.e.preventDefault();
        event.e.stopPropagation();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    if (editor?.canvas) {
      editor.canvas.on("path:created", onPathCreated);
      editor.canvas.on("object:modified", handleObjectModified);
      editor.canvas.on("selection:created", handleObjectSelected);
      editor.canvas.on("selection:updated", handleObjectSelected);
      editor.canvas.on("selection:cleared", handleObjectCleared);
      editor.canvas.on("mouse:wheel", handleCanvasZoom);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (editor?.canvas) {
        editor.canvas.off("path:created", onPathCreated);
        editor.canvas.off("object:modified", handleObjectModified);
        editor.canvas.off("selection:created", handleObjectSelected);
        editor.canvas.off("selection:updated", handleObjectSelected);
        editor.canvas.off("selection:cleared", handleObjectCleared);
        editor.canvas.off("mouse:wheel", handleCanvasZoom);
      }
    };
  }, [editor, saveHistory, handleRedo, handleUndo, handleDeleteSelected]);

  const toggleAccordion = (accordion: string) => {
    setOpenAccordions((prevState) => (prevState.includes(accordion) ? prevState.filter((item) => item !== accordion) : [...prevState, accordion]));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Editor de Imágenes Médicas</h1>
        </div>
      </header>

      <main className="flex-grow flex">
        <div className="w-64 bg-white shadow-sm">
          <div className="p-4">
            <div className="space-y-2 ">
              {bodyParts.map((section) => (
                <div key={section.title} className="border rounded overflow-hidden">
                  <button
                    onClick={() => toggleAccordion(section.title)}
                    className="w-full flex items-center justify-between p-2 text-left bg-gray-100 hover:bg-gray-200"
                  >
                    {section.title}
                    <ChevronDownIcon className={`h-4 w-4 transition-transform ${openAccordions.includes(section.title) ? "transform rotate-180" : ""}`} />
                  </button>
                  {openAccordions.includes(section.title) && (
                    <div className="bg-white">
                      {section.options.map((option) => (
                        <button key={option} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-grow p-4 bg-gray-200">
          <div className="bg-white w-full h-full rounded-lg shadow-inner flex flex-col gap-2">
            <div className="flex flex-row border-b p-4">
              <div className="border-r flex items-center space-x-2">
                <button onClick={handleUndo} className="p-2 hover:bg-gray-100 rounded">
                  <UndoIcon className="h-5 w-5 text-gray-600" />
                </button>

                <button onClick={handleRedo} className="p-2 hover:bg-gray-100 rounded">
                  <RedoIcon className="h-5 w-5 text-gray-600" />
                </button>

                <button onClick={toggleDraw} className="p-2 hover:bg-gray-100 rounded">
                  <PencilIcon className="h-5 w-5 text-gray-600" />
                </button>

                <button onClick={handleZoomOut} className="p-2 hover:bg-gray-100 rounded">
                  <ZoomOutIcon className="h-5 w-5 text-gray-600" />
                </button>

                <button onClick={handleDeleteSelected} className="p-2 hover:bg-gray-100 rounded">
                  <TrashIcon className="h-5 w-5 text-gray-600" />
                </button>

                <button onClick={handleAddText} className="p-2 hover:bg-gray-300 rounded">
                  <TypeIcon className="h-5 w-5 text-gray-600" />
                </button>

                <button onClick={handleExportPNG} className="p-2 hover:bg-gray-100 rounded">
                  <DownloadIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {selectedMode === "stroke" && (
                <div className="flex items-center space-x-2 px-2">
                  <button title="Cambiar color" onClick={handleStrokeColorButtonClick} className="p-2 hover:bg-gray-100 rounded">
                    <Palette className="h-5 w-5 text-gray-600" />
                  </button>
                  <input
                    ref={strokeColorInputRef}
                    type="color"
                    value={color.stroke}
                    onChange={(event) => handleChangeColor(event, "stroke")}
                    style={{
                      position: "absolute",
                      width: 0,
                      height: 0,
                    }}
                  />
                  <div className="flex flex-col">
                    <span>Grosor del trazo: {strokeWidth}</span>
                    <input
                      type="range"
                      value={strokeWidth}
                      min={1}
                      max={50}
                      style={{
                        accentColor: "grey",
                      }}
                      onChange={handleStrokeWidth}
                    />
                  </div>
                </div>
              )}
            </div>
            <FabricJSCanvas className="sample-canvas" onReady={onReady} />
          </div>
        </div>
      </main>
    </div>
  );
}
