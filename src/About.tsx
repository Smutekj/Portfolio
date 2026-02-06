
function About() {

    const c1 = "rgba(255,255,255,0.8)";
    const c2 = "rgba(255,255,255,0.5)";
    const c3 = "rgba(255,255,255,0.2)";

    return (
        <div
            style={{
                padding: "20px",
                textAlign: "left",
                borderRadius: "16px",
                boxShadow: `0 0 6px ${c1}, 0 0 18px ${c2}, 0 0 36px ${c3}`,
                background: "rgba(25,25,25,0.6)",
            }}
            className="projectHolder"
        >
            <h2>Introduction</h2>
            <p>Hello, and welcome to my portfolio! My name is Jakub Smutek and I am C++ developer.</p>
            <p>I am a born nerd, who enjoys solving fun and challenging problems in math, physics, and programming.
                Since childhood, PC games have always held a special place in my heart,
                which is one of the reasons, why i want to become a game developer.
                What excites me most is building games from scratch and diving deep into the technical side of game development and experiencing how everything works under the hood.
                Outside of programming, I’m also interested in history and anything related to it.
            </p>
            <h2>Hobbies:</h2>
            <p>Besides programming I enjoy hiking - exploring countryside and chatting with random people along the way.
                When the weather is too bad for walking I also like bouldering and trying new recipes in my kitchen.
            </p>
            <h2>Favourite games:</h2>
            <ul>
                <li>Heroes of Might and Magic 3</li>
                <li>Planescape: Torment</li>
                <li>Starcraft 2</li>
                <li>Doom 2016</li>
            </ul>
            <h2>CV:</h2>
        </div>
    )

};


export default About;