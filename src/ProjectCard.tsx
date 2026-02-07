import './App.css'
import './ProjectCard.css'

import { ButtonWithIcon, type MotionIconType } from './CoolButton.tsx'
import { type RGBA, rgba, rgbaToCss } from './Colors.tsx'
import Game from './Game.tsx'
import { useState } from 'react'

import { FaGithub } from "react-icons/fa";
import { IoPlayOutline } from "react-icons/io5";
import { FiExternalLink } from "react-icons/fi"
import { motion } from "framer-motion";


const PlayIconMotion = motion.create(IoPlayOutline) as MotionIconType;
const GithubIconMotion = motion.create(FaGithub) as MotionIconType;
const LinkIconMotion = motion.create(FiExternalLink) as MotionIconType;


export type ProjectCardProps = {
    title: string,
    Content: React.ComponentType | null,
    githubLink: string | null,
    demoPath: string | null,
    color: RGBA | null,
}

export function ProjectCard({ title, Content, githubLink, demoPath, color }: ProjectCardProps) {

    const [demoOpened, setDemoOpened] = useState<Boolean>(false)

    function navigateToDemo() {
        if (!demoPath)
            return;

        if (demoPath.endsWith('.js')) {
            setDemoOpened(!demoOpened)
        }
        else {
            window.open(demoPath);
        }
    }
    function navigateToGithub() {
        if (githubLink) {
            window.open(githubLink);
        }
    }

    const c0 = color ? color : rgba(255,255,255, 1.0);
    const c1 = rgbaToCss(rgba(c0.r, c0.g, c0.b, 0.8));
    const c2 = rgbaToCss(rgba(c0.r, c0.g, c0.b, 0.5));
    const c3 = rgbaToCss(rgba(c0.r, c0.g, c0.b, 0.2));
    // const c1 = rgbaToCss(rgba(255,255,255, 0.8));
    // const c2 = rgbaToCss(rgba(255, 255, 255, 0.5));
    // const c3 = rgbaToCss(rgba(255, 255, 255, 0.2));


    return (
        <div style={{
            borderRadius: "16px",
            boxShadow: `0 0 6px ${c1}, 0 0 18px ${c2}, 0 0 36px ${c3}`,
            background: "rgba(25,25,25,0.6)",
            padding: "8px"
        }}
        >
            <h2>{title}</h2>
            {Content && <Content />}

            <div style={{ "display": "flex", "flexDirection": "row", "margin": "auto", justifyContent: "center" }}>
                {(demoPath?.endsWith(".html")) &&
                    <ButtonWithIcon
                        MyIcon={LinkIconMotion}
                        text={"Open Page"}
                        color={c0}
                        onClick={navigateToDemo}
                    />
                }
                {(demoPath?.endsWith(".js")) &&
                    <ButtonWithIcon
                        MyIcon={PlayIconMotion}
                        text={demoOpened ? "Close Demo" : "Open Demo"}
                        color={c0}
                        onClick={navigateToDemo}
                    />
                }
                {githubLink &&
                    <ButtonWithIcon
                        MyIcon={GithubIconMotion}
                        text={"GitHub"}
                        color={c0}
                        onClick={navigateToGithub}
                    />
                }
            </div>
            {(demoOpened && demoPath) && <Game scriptPath={`${import.meta.env.BASE_URL}${demoPath}`}></Game>}
        </div>
    )
}

export default ProjectCard;