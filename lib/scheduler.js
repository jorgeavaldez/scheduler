const { Queue, enumerate, manipulate } = require('./queue');

const Scheduler = (scheduler) => {
    if (!scheduler || !scheduler.queue) return { queue: Queue() };
    return { queue: Queue(scheduler.queue) };
};

const add = (scheduler) => (pcb) => Scheduler({
    queue: manipulate.addTo(scheduler.queue)(pcb),
});

const remove = (scheduler) => (pid = null) => {
    if (pid) {
        // find by pid
        const { i } = enumerate.searchFor(scheduler.queue)(
            (pcb) => (pcb.pid === pid));

        return Scheduler({
            queue: manipulate.removeFrom(scheduler.queue)(i),
        });
    }

    return Scheduler({
        queue: manipulate.removeFrom(scheduler.queue)(),
    });
};

const SJF = (scheduler) => enumerate.toArray(scheduler.queue)
      .sort((a, b) => a.burst - b.burst)
      .sort((a, b) => a.arrival - b.arrival);

const Priority = (scheduler) => enumerate.toArray(scheduler.queue)
      .sort((a, b) => a.priority - b.priority)
      .sort((a, b) => a.arrival - b.arrival);

module.exports = {
    Scheduler,
    manipulate: {
        add,
        remove,
    },
    strategy: {
        SJF,
        Priority,
    },
};
