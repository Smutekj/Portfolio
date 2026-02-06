import './CoolButton.css'

import { useState, useEffect } from 'react'
import { type RGBA, rgba, rgbaToCss } from './Colors.tsx'

import { IconContext, type IconType } from "react-icons";
import { type MotionProps, motion, animate} from "framer-motion";
import { type ComponentType } from "react";
import { type IconBaseProps } from "react-icons"

export type MotionIconType = ComponentType<MotionProps & IconBaseProps>;

type CoolButtonProps = {

    text: String,
    primaryColor: RGBA,
    outlineColor: RGBA,
    onClick: () => void,
    isSelected: Boolean,
    Icon: IconType
};


function interpolate(c1: RGBA, c2: RGBA, alpha: number)
{
    return rgba(
        c2.r + alpha * (c2.r - c1.r),
        c2.g + alpha * (c2.g - c1.g),
        c2.b + alpha * (c2.b - c1.b),
        c2.a + alpha * (c2.a - c1.a)
    )
}

export default function CoolButton({ text, primaryColor, outlineColor, onClick, isSelected, Icon }: CoolButtonProps) {

    const [hovered, setHovered] = useState<boolean>(false);
    const [iconColor, setIconColor] = useState<string>(rgbaToCss(outlineColor));
    useEffect(() => {
        const newColor = hovered  || isSelected ? rgba(255,255,255, 1) : outlineColor;
        const controls = animate(0, 1,
            {
                onUpdate: (progress: number) => {
                    const currentColor = interpolate(outlineColor, newColor, progress) 
                    setIconColor(rgbaToCss(currentColor));
                }
            ,
                duration: 0.69
            });

        return () => controls.stop(); // cleanup on unmount
    }, [hovered, isSelected, outlineColor]); // add dependencies


    const c1 = rgbaToCss(rgba(primaryColor.r, primaryColor.g, primaryColor.b, 0.8));
    const c2 = rgbaToCss(rgba(primaryColor.r, primaryColor.g, primaryColor.b, 0.5));
    const c3 = rgbaToCss(rgba(primaryColor.r, primaryColor.g, primaryColor.b, 0.2));

    return (

        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: rgbaToCss(primaryColor),
                borderColor: rgbaToCss(outlineColor),
                borderWidth: isSelected ?  "2px" : "1px",
                boxShadow: hovered || isSelected ? `0 0 8px ${c1}, 0 0 16px ${c2}, 0 0 24px ${c3}` : "none"
            }}
            className="coolButton"
        >
            <span style={{ textAlign: "center", alignItems: "center", flex: 1}}>{text}</span>
            <div
                className='highLightCircle'
                style={{
                    background: c2,
                    border: "solid",
                    borderWidth: "2px",
                    borderColor: iconColor
                }}>
                <IconContext.Provider value={{
                    size: "20px",
                    color: iconColor
                }}>
                    <>
                        <Icon />
                    </>
                </IconContext.Provider>
            </div>
        </button >
    );
}



type ButtonWithIconProps = {
    MyIcon: MotionIconType,
    text: string | null,
    color: RGBA
    onClick: () => void,
}

export function ButtonWithIcon({ MyIcon, text, color, onClick }: ButtonWithIconProps) {

    const [hovered, setHovered] = useState<Boolean>(false)

    const c1 = rgbaToCss(rgba(color.r, color.g, color.b, 0.8));
    const c2 = rgbaToCss(rgba(color.r, color.g, color.b, 0.5));
    const c3 = rgbaToCss(rgba(color.r, color.g, color.b, 0.1));

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: c3,
                position: "relative",
                borderColor: rgbaToCss(color),
                margin: "10px",
                width: "200px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: hovered ?
                    `0 0 6px ${c1}, 0 0 18px ${c2}, 0 0 36px ${c3}` :
                    "none"
            }}
        >

            <motion.div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0
            }}>
            </motion.div>
            <span style={{ margin: "10px" }}> {text}</span>
            <MyIcon
                size={20}
                animate={{
                    scale: hovered ? 1.4 : 1.0,
                    // color: hovered ? rgbaToCss(color) : "#ffffff"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
        </button>
    )
}

