

export default function CountryInfo({ data, unfocus }) {

    return (
        <div className="info-container">
            <div className="darkness" onClick={(unfocus)} />
            <div className="info-main">
                {Object.keys(data.properties).map(x => {

                    return (
                        <div>{x}: {data.properties[x]}</div>
                    )
                })}
            </div>

            <div className="info-close" onClick={unfocus}>
                X
            </div>

        </div>
    )
}  