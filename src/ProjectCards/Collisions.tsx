

export default function CollisionDetectionCard() {

    return (
        <>
            <div style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
                padding: "10px"
            }}>
                <p>
                    Collision detection is a quintessential ingredient in most games, especially when those games involve a physical simulation.
                    Usually collision detection task involves two steps.
                    Obviously, one must determining whether two objects overlap and if they do it is useful to find how they intersect.
                    There two main groups of algorithms: the separating axis theorem (SAT) and minkowski difference algorithms. Here you can find an interactive demonstration of the algorithms from the latter group:
                    the Gilbert-Johsnon-Keerthi (GJK) and Minkowski Portal Refinement (MPR).
                </p>
                <div style={{
                    display: "flex",
                    flexDirection: "row"
                }}>
                    <div>
                        <h3 style={{textAlign: "center"}}>GJK</h3>
                        <div>
                            <p style={{ textAlign: "left", padding: "10px" }}>
                                The GJK algorithm scans the minkowski difference set by maintaing a simplex, which we know lies inside the set.
                                The simplex then "walks" towards the origin by first finding the closest point on the simplex to the origin and then projecting that point onto the minkowski set in the direction towards the origin.
                            </p>
                        </div>
                    </div>
                    <div>
                        <h3>Minkowski Portal Refinement</h3>
                        <div>
                            <p style={{ textAlign: "left", padding: "10px" }}>
                                The MPR algorithm, on the other hand, maintains a triangle (called portal) inside the minkowski set (or a tetrahedron in 3D).
                                The algorithm then reduces then moves the portal towards the origin until either it contains the origin or a some separating axis is found.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}