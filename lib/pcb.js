const DEFAULT_PCB = {
    pid: null,
    arrival: null,
    burst: null,
    priority: null,
};

const PCB = (pcb = DEFAULT_PCB) => {
    if (!pcb) return null;

    const {
        pid,
        arrival,
        burst,
        priority,
    } = {
        ...DEFAULT_PCB,
        ...pcb,
    };

    return {
        pid,
        arrival,
        burst,
        priority,
    };
};

module.exports = PCB;
