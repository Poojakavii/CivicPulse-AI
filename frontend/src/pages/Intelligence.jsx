import { useEffect, useState } from "react";
import { getDashboard } from "../services/api";


function Intelligence() {

    const [data, setData] = useState(null);


    useEffect(() => {

        async function load() {

            try {

                const result =
                    await getDashboard();

                setData(result);

            } catch (error) {

                console.error(error);

            }

        }

        load();

    }, []);


    const stats =
        data?.statistics || {};


    const problems =
        data?.most_reported_problems || [];


    return (

        <main className="intelligence-page">

            <section className="page-header">

                <div className="badge">
                    AI CIVIC INTELLIGENCE
                </div>

                <h1>
                    Understand what is happening.
                </h1>

                <p>
                    CivicPulse converts citizen reports
                    into actionable intelligence.
                </p>

            </section>


            <section className="intelligence-stats">

                <div className="intel-card">

                    <span>📋</span>

                    <small>
                        TOTAL SIGNALS
                    </small>

                    <strong>
                        {stats.total_reports || 0}
                    </strong>

                </div>


                <div className="intel-card">

                    <span>🔴</span>

                    <small>
                        HIGH RISK
                    </small>

                    <strong>
                        {stats.high_risk_reports || 0}
                    </strong>

                </div>


                <div className="intel-card">

                    <span>📍</span>

                    <small>
                        HOTSPOTS
                    </small>

                    <strong>
                        {stats.emerging_hotspots || 0}
                    </strong>

                </div>


                <div className="intel-card">

                    <span>✅</span>

                    <small>
                        RESOLVED
                    </small>

                    <strong>
                        {stats.resolved_reports || 0}
                    </strong>

                </div>

            </section>


            <section className="intelligence-grid">

                <div className="intel-panel">

                    <div className="panel-label">
                        PATTERN DETECTION
                    </div>

                    <h2>
                        What is increasing?
                    </h2>

                    {problems.length > 0 ? (

                        problems.map(
                            (problem, index) => (

                                <div
                                    className="trend-row"
                                    key={index}
                                >

                                    <div>

                                        <strong>
                                            {problem.category}
                                        </strong>

                                        <small>
                                            {problem.count}
                                            {" "}
                                            reports
                                        </small>

                                    </div>

                                    <span>
                                        ↑
                                    </span>

                                </div>

                            )
                        )

                    ) : (

                        <p className="empty">
                            Submit reports to
                            generate patterns.
                        </p>

                    )}

                </div>


                <div className="intel-panel forecast">

                    <div className="panel-label">
                        RISK FORECAST
                    </div>

                    <h2>
                        Civic risk outlook
                    </h2>

                    <div className="forecast-bars">

                        <div>
                            <span>
                                Today
                            </span>

                            <i style={{
                                width: "48%"
                            }}></i>
                        </div>

                        <div>
                            <span>
                                +1 day
                            </span>

                            <i style={{
                                width: "61%"
                            }}></i>
                        </div>

                        <div>
                            <span>
                                +2 days
                            </span>

                            <i style={{
                                width: "70%"
                            }}></i>
                        </div>

                        <div>
                            <span>
                                +3 days
                            </span>

                            <i style={{
                                width: "82%"
                            }}></i>
                        </div>

                        <div>
                            <span>
                                +4 days
                            </span>

                            <i style={{
                                width: "89%"
                            }}></i>
                        </div>

                    </div>


                    <div className="forecast-warning">

                        ⚠️

                        <div>

                            <strong>
                                Potential escalation
                            </strong>

                            <p>
                                Current activity suggests
                                that unresolved problems
                                may increase local risk.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            <section className="ai-explanation">

                <div className="ai-icon">
                    ✦
                </div>

                <div>

                    <div className="panel-label">
                        AI EXPLANATION
                    </div>

                    <h2>
                        Why this matters
                    </h2>

                    <p>
                        CivicPulse connects repeated
                        reports, location patterns and
                        severity signals to identify
                        problems that deserve attention
                        before they become larger
                        community issues.
                    </p>

                </div>

            </section>

        </main>

    );

}


export default Intelligence;