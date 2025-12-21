import { skillCategories } from '../data/resume'

const Skills = () => {
  return (
    <section id="skills" className="py-16 md:py-24 bg-base-200">
      <div className="container mx-auto px-6 max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Skills
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {skillCategories.map((category) => (
            <div
              key={category.name}
              className="bg-base-100 rounded-lg p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold mb-4 text-primary">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span key={skill} className="badge badge-outline badge-lg">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
