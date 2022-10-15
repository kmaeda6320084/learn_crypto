module Jekyll 
    class CategoryPageGenerator < Jekyll::Generator
        safe true

        def generate(site)
            dir = site.config['settings']['category_path']
            site.categories.each_key do |category|
                site.pages << CategoryPage.new(site, site.source, File.join(dir, category), category)
            end
        end
    end

    class CategoryPage < Jekyll::Page
        def initialize(site, base, dir, tag)
            @site, @base, @dir = site, base, dir
            @name = "#{tag}.html"

            self.content = <<~TEXT
            ---
            layout: default
            parmalink: "#{dir}/#{Jekyll::Utils.slugify(category)}"
            category: #{category}
            ---
            <h1>Category : {{ page.category }}</h1>
            <hr>
            {% if site.tags[page.category] %}
            <ul>
                {% assign post_by_date = site.tags[page.category] | sort:"date" | reverse %}
                {% for post in post_by_date %}
                <li>
                    <a href="{{ post.url | relative_url }}">
                        {{ post.title }}
                    </a>
                </li>
                {% endfor %}
            </ul>
            {% endif %}
            TEXT
        end
    end
end