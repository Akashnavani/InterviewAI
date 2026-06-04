const AuthVisual = ({ mode }) => {
    const isRegister = mode === "register"

    return (
        <aside className="auth-visual" aria-hidden="true">
            <div className="auth-brand">
                <div className="auth-brand__mark">P</div>
                <span>PrepAI</span>
            </div>

            <div className="auth-visual__copy">
                <p>{isRegister ? "New prep room" : "Interview workspace"}</p>
                <h2>{isRegister ? "Turn your profile into a focused plan." : "Pick up right where your preparation left off."}</h2>
            </div>

            <div className="prep-snapshot">
                <div className="prep-snapshot__header">
                    <span>Role Match</span>
                    <strong>{isRegister ? "82%" : "91%"}</strong>
                </div>

                <div className="prep-meter">
                    <span style={{ width: isRegister ? "82%" : "91%" }} />
                </div>

                <div className="prep-stack">
                    <div className="prep-row">
                        <span className="prep-row__dot prep-row__dot--teal" />
                        <span>Technical round</span>
                        <strong>{isRegister ? "5 tasks" : "Ready"}</strong>
                    </div>
                    <div className="prep-row">
                        <span className="prep-row__dot prep-row__dot--amber" />
                        <span>Behavioral answers</span>
                        <strong>{isRegister ? "Draft" : "12 saved"}</strong>
                    </div>
                    <div className="prep-row">
                        <span className="prep-row__dot prep-row__dot--rose" />
                        <span>Skill gaps</span>
                        <strong>{isRegister ? "3 found" : "1 left"}</strong>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default AuthVisual
