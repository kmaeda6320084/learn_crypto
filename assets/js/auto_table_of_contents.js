const tocMarker = 'auto-table-of-contents-toc';
window.autoc = {
    createTableOfContents: function (node, options = {}) {
        const headings = iterateHeadings(node);
        let indexed;
        if (options.hasOwnProperty('definedIdOnly')) {
            indexed = hasId(headings);
        } else {
            indexed = coalesceId(headings);
        }
        const toc = makeToc(0, peekable(indexed));
        toc.classList.add(tocMarker);
        return toc;

        function makeToc(depth, peekable) {
            const headingLevelRegex = /\d+$/;
            const list = document.createElement('ul');
            while (true) {
                const current = peekable.peek();
                if (current.done) break;
                const [currentDepth] = current.value.nodeName.match(headingLevelRegex);
                if (currentDepth <= depth) break;
                peekable.next();
                const item = document.createElement('li');
                const a = document.createElement('a');
                a.innerHTML = current.value.innerHTML;
                a.href = `#${current.value.id}`;
                item.append(a);
                const children = makeToc(depth + 1, peekable);
                if (children.childElementCount > 0) {
                    item.append(children);
                }
                list.append(item);
            }
            return list;
        }

        function* iterateHeadings(root) {
            for (const child of root.children) {
                if (child instanceof HTMLHeadingElement) {
                    yield child;
                }
                yield* iterateHeadings(child);
            }
        }

        function* hasId(iterator) {
            for (const item of iterator) {
                if (!!item.id)
                    return item;
            }
        }

        function* coalesceId(iterator) {
            let index = 0;
            const uuid = window.crypto.randomUUID();
            for (const item of iterator) {
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
    if (target.tagName !== "LI" || !target.closest(`ul.${tocMarker}`)) {
        return;
    }

    if (target.classList.contains(activeMarker)) {
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
