const DEFAULT_NODE = { value: null, next: null };
const Node = (node = DEFAULT_NODE) => {
    if (!node) return null;

    const { value, next } = {
        ...DEFAULT_NODE,
        ...node,
    };

    return {
        value,
        next: Node(next),
    };
};

const DEFAULT_QUEUE = { head: null, tail: null, length: 0 };
const Queue = (queue) => {
    if (!queue) return DEFAULT_QUEUE;
    const { head } = {
        ...DEFAULT_QUEUE,
        ...queue,
    };

    if (!head) return queue;
    const headClone = Node(head);

    // get the new tail reference and the length after cloning the head
    const { tail, length } = reduceFor({ head: headClone })(
        (_, node, i) => ({ tail: node, length: i + 1 })
    );

    return {
        head: headClone,
        tail,
        length,
    };
};

const assertQueue = (queue, assertEmpty = true) => {
    if (!queue) {
        throw new Error('Function was called with a null queue.');
    }

    if (assertEmpty && !queue.head) {
        throw new Error('Function was called with an empty queue.');
    }
};

const assertIndexBounds = (queue) => {
    assertQueue(queue);

    return (index, assertLength = true) => {
        const { length } = queue;

        if (index < 0) {
            console.log('PID not found');

            throw new Error(
                'Given index is less than length.' +
                `\nQueue: ${JSON.stringify(queue)}\nIndex: ${index}`
            );
        }

        if (assertLength && index >= length) {
            console.log('PID not found');

            throw new Error(
                'Given index is greater than length.' +
                `\nQueue: ${JSON.stringify(queue)}\nIndex: ${index}`
            );
        }
    };
};

const mapFor = (queue) => {
    assertQueue(queue, false);
    return (process) => {
        let node = queue.head;
        let i = 0;
        let newQueue = Queue();

        while (node) {
            newQueue = addTo(newQueue)(process(node.value, node, i, queue));
            node = node.next;
            i++;
        }

        return acc;
    };
};

const reduceFor = (queue) => {
    assertQueue(queue, false);
    return (process, init = undefined) => {
        let node = queue.head;
        let acc = init === undefined ? node : init;
        let i = 0;

        while (node) {
            acc = process(acc, node, i, queue);
            node = node.next;
            i++;
        }

        return acc;
    };
};

const nodeFrom = (queue) => (targetIndex) => reduceFor(queue)(
    (target, node, i) => {
        if (targetIndex === i) return node;
        return target;
    },
    undefined
);

const addTo = (queue) => {
    assertQueue(queue, false);
    return (value, index = null) => {
        const q = Queue(queue);
        const { head, tail, length } = q;

        if (!head && !tail) return Queue({ head: Node({ value }) });

        // add to end
        if (!index || index >= length - 1) {
            tail.next = Node({ value });
            return Queue({ head });
        }

        assertIndexBounds(q)(index, false);

        if (index === 0) return Queue({ head: Node({ value, next: head }) });

        const previous = nodeFrom(q)(index);
        previous.next = Node({ value, next: previous.next });

        return Queue({ head });
    };
};

const removeFrom = (queue) => {
    assertQueue(queue, true);
    return (index = null) => {
        const q = Queue(queue);
        const { head, length } = q;

        // remove from beginning
        if (!index || index === 0) return Queue({ head: head.next });

        assertIndexBounds(q)(index);

        // remove from the end
        if (index === length - 1) {
            const previous = nodeFrom(q)(length - 2);
            previous.next = null;
            return Queue({ head });
        }

        const previous = nodeFrom(q)(index - 1);
        previous.next = Node(...previous.next.next);

        return Queue({ head });
    };
};

const searchFor = (queue) => {
    assertQueue(queue, true);
    return (comparator) => reduceFor(queue)((target, node, i) => {
        if (target) return target;

        const { value } = node;
        const found = comparator(value);
        if (found) return { i, value };

        return null;
    }, null);
};

const toArray = (queue) => {
    assertQueue(queue, false);
    return reduceFor(queue)(
        (acc, node) => [...acc, node.value],
        []
    );
}

module.exports = {
    Queue,
    enumerate: {
        reduceFor,
        mapFor,
        nodeFrom,
        searchFor,
        toArray,
    },
    manipulate: {
        addTo,
        removeFrom,
    },
};
