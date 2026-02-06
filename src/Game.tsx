import { useEffect, useRef } from "react";


type GameProps = {
    scriptPath: string
};

export default function Game({ scriptPath }: GameProps) {

    const iframeRef = useRef<HTMLIFrameElement>(null);
    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) return;

        iframeDoc.open();
        iframeDoc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { margin: 0; overflow: hidden; }
                    #canvas { width: 1200; height: 800; }
                </style>
            </head>
            <body>
                <canvas
                    id="canvas"
                    oncontextmenu="event.preventDefault(); return false;">
                </canvas>
                <textarea id="output" style="display:none;"></textarea>
                <script>
                    var Module = {
                        print: function(...args) {
                            console.log(...args);
                        },
                        canvas: document.getElementById('canvas'),
                        setStatus: function(text) {
                            console.log(text);
                        }
                    };
                </script>
                <script async src="${scriptPath}"></script>
            </body>
            </html>
        `);
        iframeDoc.close();

        return () => {
            // Cleanup by reloading iframe
            if (iframe.contentWindow) {
                iframe.src = 'about:blank';
            }
        };
    }, [scriptPath]);

    // useEffect(() => {
    //     var statusElement = document.getElementById('status');
    //     var progressElement = document.getElementById('progress');
    //     var spinnerElement = document.getElementById('spinner');
    //     var canvasElement = document.getElementById('canvas');
    //     var outputElement = document.getElementById('output')

    //     if (!canvasElement)
    //         return

    //     (window as any).Module = {
    //         print(...args: any) {
    //             console.log(...args);
    //             if (outputElement) {
    //                 var text = args.join(' ');
    //                 outputElement.value += text + "\n";
    //                 outputElement.scrollTop = outputElement.scrollHeight; // focus on bottom
    //             }
    //         },
    //         canvas: canvasElement,
    //         setStatus(text: String) {
    //             console.log(text)
    //         },
    //         totalDependencies: 0,
    //     };
    //     (window as any).Module.setStatus('Downloading...');
    //     window.onerror = (event) => {
    //         const Module = (window as any).Module
    //         Module.setStatus('Exception thrown, see JavaScript console');
    //         Module.setStatus = (text: any) => {
    //             if (text) console.error('[post-exception status] ' + text);
    //         };
    //     };

    //      let scriptElement = document.getElementById("script") as HTMLScriptElement | null
    //     if (!scriptElement) {
    //         scriptElement = document.createElement("script") as HTMLScriptElement
    //         scriptElement.async = true
    //         scriptElement.id = "script"
    //         scriptElement.src = scriptPath

    //         document.body.appendChild(scriptElement);
    //     } else {
    //         scriptElement.src = scriptPath
    //     } 
    // }, [scriptPath]) 

    return (
        <iframe
            ref={iframeRef}
            onContextMenu={(event) => event.preventDefault()}
            style={{ width: '1200px', height: '800px', border: 'none' }} />
        // <div>
        //     <div className="emscripten_border">
        //         <canvas className="emscripten"
        //             id="canvas"
        //             onContextMenu={(event) => event.preventDefault()}
        //             tabIndex={-1}>
        //         </canvas>
        //     </div>
        //     <textarea id="output" rows={8}></textarea>
        // </div>
    );
}