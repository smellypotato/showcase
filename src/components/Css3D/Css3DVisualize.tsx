import "./Css3DVisualize.css";

export const Css3DVisualize = (props: { perspective: number, perspectiveOriginY: number, tableRotateX: number, tableZ: number }) => {

    return (
        <div id="css-3d-visualize">
            <div id="css-3d-visualize-screen" style={ { transform: `translateY(${props.perspectiveOriginY}px)`}}/>
            <div id="css-3d-visualize-viewcone" style={ {
                borderTopWidth: `${100 + props.perspectiveOriginY}px`,
                borderBottomWidth: `${100 - props.perspectiveOriginY}px`,
                borderLeftWidth: `${props.perspective}px` } }
            />
            <div id="css-3d-visualize-space">
                <div id="css-3d-visualize-table" style={ { transform: `translate(${props.tableZ}px) rotateZ(${-props.tableRotateX}deg) ` } }/>
            </div>
        </div>
    )

}
