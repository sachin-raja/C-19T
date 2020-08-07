import React from 'react'
import './InfoBox.css';
import {
    Card,
    CardContent,
    Typography,
  } from "@material-ui/core";
function InfoBox({title, cases, isRed, active, total, ...props}) {
    return (
        <Card onClick= {props.onClick} className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"}`}>
            <CardContent>
                {/* Title ie corona virus cases */}
                <Typography className="infoBox_title" color="textSecondary">{title}</Typography>
                {/* 100K+ Number of Cases */}
                <h2 className={`infoBox_cases ${!isRed && "infoBox_cases--green"}`}>{cases}</h2>
                {/* 1.2M total cases */}
                <Typography className="infoBox_total" color="textSecondary">{total} Total Cases </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
