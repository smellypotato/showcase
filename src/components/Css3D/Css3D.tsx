import "./Css3D.css";

export const Css3D = (props: { perspective: number, perspectiveOriginY: number, tableRotateX: number, tableZ: number }) => {

    // perspective defines the virtual distance between the plane of computer screen and the html element need to apply translateZ

    return (
        <div id="css-3d-camera" style={ { perspective: `${props.perspective}px`, perspectiveOrigin: `center ${props.perspectiveOriginY}px` } }>
            <div id="css-3d-space">
                <div id="css-3d-table" style={ { transform: `translateZ(${props.tableZ}px) rotateX(${props.tableRotateX}deg)` } }>
                    { Array(8).fill(null).map((_, i) =>
                        <button onClick={ () => console.log(i + 1) }>{ i + 1 }</button>) }
                </div>
            </div>
        </div>
    )
}
