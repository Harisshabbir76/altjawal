import '../../styles/homepage/experiencesection.css';

const stats = [
  { value: '10+', label: 'Years of Experience' },
  { value: '27+', label: 'Successful Projects' },
  { value: '5',   label: 'Emirates Served' },
  { value: '19+', label: 'Satisfied Clients' },
];

export default function ExperienceSection() {
  return (
    <>
    <section className="experience-section">
      <h2 className="experience-heading">Creating Experiences That Matter</h2>
      <div className="experience-stats">
        {stats.map((stat, i) => (
          <div className="experience-stat" key={i}>
            <span className="experience-value">{stat.value}</span>
            <span className="experience-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
    <hr className="vision-divider" />
    </>
  );
}
