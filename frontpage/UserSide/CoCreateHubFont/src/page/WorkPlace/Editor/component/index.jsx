import React from "react";
import {cx, css} from "@emotion/css";

export const Button = React.forwardRef(({active, ...prop}, ref)=>(
    <span
        ref={ref}
        {...prop}
        className={cx(
            css`
                color: ${
                active?
                       'black'
                        :'#999999'
            };
                cursor: pointer;
                margin: 12px;
                
            `

        )}
    />
))

export const Icon = React.forwardRef(({...props}, ref)=>(
    <span
        ref={ref}
        {...props}
        className={cx(
            css`
                font-size: 18px;
                vertical-align: text-bottom;
                
            `
        )}
    />
))

export const TopBar = React.forwardRef(({...props}, ref)=>(
    <div
        className={cx(

            css`
                position: relative;
                padding: 20px 15px 12px 18px;
                border-bottom: 2px solid #eee;
                margin: 0 10px 20px;
                
            `
        )}
        ref={ref}
        {...props}
    />
))
