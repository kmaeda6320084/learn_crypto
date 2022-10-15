require 'json'

module Jekyll 
    module AdditionalFilters
        def escape_path(input)
            Jekyll::URL.escape_path(Jekyll::Utils.slugify(input))
        end
        module_function :escape_path
        public :escape_path
        def unescape_path(input)
            Jekyll::URL.unescape_path(input)
        end
        module_function :unescape_path
        public :unescape_path

        def pretty_jsonify(input)
            JSON.pretty_generate(input)
        end
        module_function :pretty_jsonify
        public :pretty_jsonify
    end
end
  
Liquid::Template.register_filter(AdditionalFilters)