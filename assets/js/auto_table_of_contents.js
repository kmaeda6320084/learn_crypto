const tocMarker = 'auto-table-of-contents-toc';
window.autoc = {
    createTableOfContents: function(node, options={}) {
        const headings = iterateHeadings(node);
        let indexed;
        if(options.hasOwnProperty('definedIdOnly')) {
            indexed = hasId(headings);
        } else {
            indexed = coalesceId(headings);
        }
        const list = document.createElement('ul');
        list.classList.add(tocMarker);
        list.append(...createItems(1, peekable(indexed)));
        return list;

    
        function createItems(depth, iterator) {
            const headingLevelRegex = /\d+$/;
            const buffer = new Array();
            do {
                const current = iterator.peek();
                if (current.done) break;
                const [currentDepth] = current.value.nodeName.match(headingLevelRegex);
                if (currentDepth < depth) break;
                if (currentDepth == depth) {
                    iterator.next();
                    const item = document.createElement('li');
                    const a = document.createElement('a');
                    item.append(a);
                    a.innerHTML = current.value.innerHTML;
                    a.href = `#${current.value.id}`;
                    buffer.push(item);
                } else {
                    const item = document.createElement('ul');
                    item.append(...createItems(currentDepth, iterator));
                    buffer.push(item);
                }
            } while (true);
    
            return buffer;
        }
    
        function* iterateHeadings(root) {
            for (const child of root.children) {
                if (child instanceof HTMLHeadingElement) {
                    yield child;
                }
                yield* iterateHeadings(child);
            }
        }
    
        function* hasId(iterator){
            for(const item of iterator) {
                if(!!item.id)
                    return item;
            }
        }

        function* coalesceId(iterator)
        {
            let index = 0;
            const uuid = window.crypto.randomUUID();
            for(const item of iterator) {
                item.id ??= `auto-toc-${uuid}-${index}`;
                index++;
                yield item;
            }
        }
    
    }
};


const activeMarker = 'auto-table-of-contents-toc-menu-active';
document.addEventListener('click', (e) => {
    const target = e.target;
    if(target.tagName !== "LI" || !target.closest(`ul.${tocMarker}`)) {
        return;
    }

    if(target.classList.contains(activeMarker)) {
        target.classList.remove(activeMarker);
    } else {
        target.classList.add(activeMarker);
    }
}); 

function peekable(iterator) {
    return {
        peeked: undefined,
        iter: iterator,
        next: function () {
            if (this.peeked === undefined) {
                return this.iter.next();
            }
            const ret = this.peeked;
            this.peeked = undefined;
            return { done: false, value: ret };
        },
        peek: function () {
            if (this.peeked !== undefined) {
                return { done: false, value: this.peeked };
            }
            const { done, value } = this.iter.next();
            if (done) return { done: true };
            this.peeked = value;
            return { done: false, value: value, };
        }
    };
}
