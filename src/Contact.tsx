
type ContactInfoProps = {
    name: string;
    email: string;
    phone?: string;
    website?: string;
};

export function ContactInfo({
    name,
    email,
    phone,
    website,
}: ContactInfoProps) {
    return (
        <div style={styles.card}>
            <h2 style={styles.name}>{name}</h2>

            <p>
                📧 <a href={`mailto:${email}`}>{email}</a>
            </p>

            {phone && <p>📞 {phone}</p>}

            {website && (
                <p>
                    🌐{" "}
                    <a href={website} target="_blank" rel="noopener noreferrer">
                        {website}
                    </a>
                </p>
            )}
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    card: {
        maxWidth: 320,
        padding: "1rem",
        borderRadius: 8,
        border: "1px solid #ddd",
        fontFamily: "sans-serif",
    },
    name: {
        marginBottom: "0.5rem",
    },
};