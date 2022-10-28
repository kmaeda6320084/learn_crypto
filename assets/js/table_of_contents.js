window.autoc = {
    createTableOfContents: function(node) {
        const headings = iterateHeading(node);
        const list = document.createElement('ul');
        list.append(...createItems(1, peekable(headings)));
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
                    item.append(current.value.innerHTML);
                    buffer.push(item);
                } else {
                    const item = document.createElement('ul');
                    item.append(...createItems(currentDepth, iterator));
                    buffer.push(item);
                }
            } while (true);
    
            return buffer;
        }
    
        function* iterateHeading(root) {
            for (const child of root.children) {
                if (child instanceof HTMLHeadingElement) {
                    yield child;
                }
                yield* iterateHeading(child);
            }
        }
    
    }
};

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
