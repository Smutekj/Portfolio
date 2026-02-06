
export type UseListProps = {
    uses: string[]
};

export function UsesList({ uses }: UseListProps) {

    return (
        <>
            <h3>Uses</h3>
            <ul>
                {uses.map((use, index) => {
                    return <li style={{ "textAlign": "left" }} key={index}>{use}</li>;
                })}
            </ul>
        </>
    )
};


const features = [
    "Can be compiled into WebAssembly with Emscripten",
    "Minimizes GL state changes by using batches",
    "Uses Instancing for sprites and text rendering",
    "Includes common post processing effects like bloom or edge detection",
    "Possibile to customize rendering with user-defined vertex/instance attributes"
];

export default function GraphicsCard() {

    return (
        <>
            <div style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
                padding: "10px"
            }}>
                <p>
                    Simple library for 2D graphics using the OpenGLES-3.0 graphics api.
                </p>
                <UsesList uses={features} />
            </div>
        </>
    );
}