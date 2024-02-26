import { useRef, useState } from "react";
import { useColumns } from "./useColumns";
import "./useColumnsPage.css";

export const UseColumnsPage = () => {
    const [minWidth, setMinWidth] = useState(200);
    const [gap, setGap] = useState(10);
    const containerRef = useRef<HTMLDivElement>(null);
    const columns = useColumns(containerRef, minWidth, gap);
    return (
        <main id="useColumnsPage">
            <h2 className="f_24">useColumns</h2>
            <section id="useColumnsPageInfo">
                <div>{`Column min size: ${200}px`}</div>
                <div>{`Gap: ${10}px`}</div>
                <div>{`Max Columns: ${columns}`}</div>
            </section>
            <section id="useColumnsPageContainer" ref={containerRef} style={ { "--columns": columns, "--gap": gap } as React.CSSProperties }>
                { Array(columns).fill("").map((_, i) => <div key={ i }>{i}</div>)}
            </section>
        </main>
    )
}