require "fileutils"

def category_page_content(dir, category)
    return <<~TEXT
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

Jekyll::Hooks.register :site, :post_write do |site|
    config = site.config
    source = File.expand_path(config["source"])
    path = config["collections"]["categories"]["directory"]
    dir = File.join(source, path)
    if File.exists?(dir) then
        p "delete #{dir}"
        FileUtils.rm_r(dir)
    end
    p "create #{dir}"
    Dir.mkdir(dir)

    site.tags.keys.each do |tag|
        file = File.join(dir, "#{tag}.html") 
        File.write(file, category_page_content(dir, tag))
        p "generated: #{file}"
    end
end