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
                    body { margin: 0; overflow: hidden; background: black}
                    #canvas { width: 1200; height: 800; }
                    .loader {
                                width: 48px;
                                height: 48px;
                                border: 5px solid #FFF;
                                border-bottom-color: #FF3D00;
                                border-radius: 50%;
                                display: inline-block;
                                box-sizing: border-box;
                                animation: rotation 1s linear infinite;
                            }
                    #gameLoader {
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                background: black;
                            }
                    @keyframes rotation {
                                0% {
                                    transform: rotate(0deg);
                                }
                                100% {
                                    transform: rotate(360deg);
                                }
                            }
                </style>
            </head>
            <body>
                <canvas
                    id="canvas"
                    oncontextmenu="event.preventDefault(); return false;">
                </canvas>
                <textarea id="output" style="display:none;"></textarea>
                <span id="gameLoader" class="loader" style="position:absolute;background:black;"></span>
                <script>
                    var Module = {
                        onRuntimeInitialized: ()=>{
                            document.getElementById("gameLoader").style.visibility = "hidden";
                        },
                        print: function(...args) {
                            console.log(...args);
                        },
                        canvas: document.getElementById('canvas'),
                        setStatus: function(text) {
                            console.log(text);
                        }
                    };
                    // Load the script after a brief delay
                    setTimeout(()=>{
                        const gameEl = document.getElementById("gameScript");
                        if(gameEl){ gameEl.remove(); }
                        const script = document.createElement('script');
                        script.id = "gameScript"
                        script.src = "${scriptPath}";
                        document.body.appendChild(script);
                    }, 400)
                </script>
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


    return (
        <>
            <iframe
                ref={iframeRef}
                onContextMenu={(event) => event.preventDefault()}
                style={{ width: '1200px', height: '800px', border: 'none' }} />

        </>
    );
}