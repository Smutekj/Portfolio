import './App.css';

import { useState, useEffect } from 'react';

import projectsData from "./assets/projects.json" with { type: "json" };

import CollisionDetectionCard from './ProjectCards/Collisions.tsx';
import GraphicsCard from './ProjectCards/Graphics.tsx';
import ProjectCard, { type ProjectCardProps } from './ProjectCard.tsx';
import { BeehiveWebGL } from './Background.tsx';
import About from './About.tsx';
import { ContactInfo } from './Contact.tsx';
import { type RGBA, rgba, rgbaToCss, cssToRgba } from './Colors.tsx'
import CoolButton, { ButtonWithIcon, type MotionIconType } from './CoolButton.tsx';

import { type IconType } from "react-icons"
import { GiPathDistance } from "react-icons/gi";
import { TbVectorTriangle, TbVocabulary } from "react-icons/tb";
import { PiPaintBrushBold } from "react-icons/pi";
import { SlRocket } from "react-icons/sl";
import { LuShapes } from "react-icons/lu";
import { CiBoxes } from "react-icons/ci";
import { HiOutlineQuestionMarkCircle} from "react-icons/hi";
import { IoLibrary } from "react-icons/io5";
import { useMotionValue, animate, motion } from 'framer-motion';


const ProjectsIconMotion = motion.create(IoLibrary) as MotionIconType;
const AboutIconMotion = motion.create(HiOutlineQuestionMarkCircle) as MotionIconType;

const ANIMATION_TRANSFER_TIME = 400;

var projectCardsData: ProjectCardProps[] = [];

function parseProjectsData() {
  Object.entries(projectsData).forEach(([projectName, pData]) => {
    var d: ProjectCardProps = {
      title: projectName,
      demoPath: pData.DemoLink,
      githubLink: pData.GithubLink.length > 0 ? pData.GithubLink : null,
      Content: null,
      color: null
    };
    projectCardsData.push(d)
  }
  )
};
parseProjectsData();

const CardType = {
  Projects: "Projects",
  About: "About",
  Contact: "Contact",
} as const;



const projectColors: Array<RGBA> = [
  rgba(0, 90, 255, 1),
  rgba(0, 198, 198, 1),
  rgba(0, 255, 155, 1),
  rgba(24, 192, 0, 1),
  rgba(235, 0, 235, 1),
  rgba(191, 101, 0, 1),
  rgba(205, 255, 0, 1),
]
const projectColors3 = projectColors.map((value) => { return rgba(value.r, value.g, value.b, 0.2) })

const ProjectCards = [
  CollisionDetectionCard,
  GraphicsCard
] 

const icons: IconType[] = [
  TbVectorTriangle,
  PiPaintBrushBold,
  GiPathDistance,
  TbVocabulary,
  SlRocket,
  LuShapes,
  CiBoxes
]

type CardTypeT = typeof CardType[keyof typeof CardType]


function App() {
  const [activeProject, setActiveProject] = useState(0)
  const [activeCard, setActiveCard] = useState<CardTypeT>(CardType.About)
  const [backgroundColor, setBackgroundColor] = useState<RGBA>(rgba(255, 255, 255, 1))
  const backgroundColorMotion = useMotionValue('rgba(255,255,255,1)');

  useEffect(() => {
    const newColor = activeCard === CardType.About
      ? 'rgba(255,255,255,1)'
      : rgbaToCss(projectColors[activeProject % projectColors.length]);

    animate(backgroundColorMotion, newColor, { duration: 0.69 });

    // Subscribe to updates if you need to set state
    backgroundColorMotion.on('change', (latest) => {
      setBackgroundColor(cssToRgba(latest));
    });
  }, [activeProject, activeCard])
  function onProjectChange(projectId: number) {

    const projEl = document.getElementById("projectHolder");
    projEl?.classList.remove("slide-in");
    projEl?.classList.add("slide-out");
    setTimeout(() => {
      setActiveProject(projectId);
      projEl?.classList.remove("slide-out");
      projEl?.classList.add("slide-in");
      setTimeout(() => {
        projEl?.classList.remove("slide-in");
      }, ANIMATION_TRANSFER_TIME)
    }, ANIMATION_TRANSFER_TIME);
  }

  function onCardChange(card: CardTypeT) {

    const projEl = document.getElementById("cardHolder");
    projEl?.classList.remove("slide-up");
    projEl?.classList.add("disappear");
    setTimeout(() => {
      setActiveCard(card);
      projEl?.classList.remove("disappear");
      projEl?.classList.add("slide-up");
      setTimeout(() => {
        projEl?.classList.remove("slide-up");
      }, ANIMATION_TRANSFER_TIME)
    }, ANIMATION_TRANSFER_TIME);
  }


  return (
    <div>
      <div className='navigationHeader'>
        <ButtonWithIcon
          MyIcon={ProjectsIconMotion}
          text={"Projects"}
          color={backgroundColor}
          onClick={() => onCardChange(CardType.Projects)} />
        <ButtonWithIcon MyIcon={AboutIconMotion} text={"Who Am I?"}
          color={backgroundColor}
          onClick={() => onCardChange(CardType.About)} />
      </div>
      {/* <div className='separator'/>*/}

      <div id="cardHolder" className='cardHolder slide-up'>
        {activeCard === CardType.Projects &&
          <>
            <div className='projectsHeader'>
              {projectCardsData.map((data, index) => {
                return <CoolButton
                  key={index}
                  text={data.title}
                  primaryColor={projectColors3[index % projectColors.length]}
                  outlineColor={projectColors[index % projectColors.length]}
                  onClick={() => onProjectChange(index)}
                  isSelected={index == activeProject}
                  Icon={icons[index]}
                />
              })}
            </div>
            <div id="projectHolder" className='projectHolder'>
              <ProjectCard
                title={projectCardsData[activeProject].title}
                Content={ProjectCards[0]}
                githubLink={projectCardsData[activeProject].githubLink}
                demoPath={projectCardsData[activeProject].demoPath}
                color={projectColors[activeProject % projectColors.length]}
              />
            </div>
          </>
        }
        {activeCard === CardType.About && <About />}
        {activeCard === CardType.Contact && <ContactInfo name={"Jakub Smutek"} email={"smutek.jakub@seznam.cz"} phone={"+420 736 270 290"} website={''} />}
      </div>
      <BeehiveWebGL primaryColor={backgroundColor} />
    </div>

  )
}

export default App
