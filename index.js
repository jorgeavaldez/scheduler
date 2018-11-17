const {
    Scheduler,
    PCB,
    readFile,
} = require('./lib');

const getLines = async (fileName) => {
  const contents = await readFile(fileName, 'utf-8');
  return contents
        .split('\n')
        .map((el) => el.trim())
        .filter((s) => s.length > 1)
        .map((el) => el.split(',').map(c => parseInt(c)));
};

const createScheduler = (lines) => lines.reduce(
  (acc, line) => Scheduler.manipulate.add(acc)(
    PCB({
      pid: line[0],
      arrival: line[1],
      burst: line[2],
      priority: line[3],
    })
  ),
  Scheduler.Scheduler()
);

const printSchedule = (schedule) => {
  let time = schedule[0].priority;
  schedule.forEach((pcb) => {
    console.log(
      `Process ${pcb.pid} executed from ${time} to ${time + pcb.burst}\n`
    );

    time += pcb.burst;
  });
};

const main = async () => {
  const fileName = process.argv[2];
  if (!fileName) throw new Error('No filename given as input');

  const lines = await getLines(fileName);
  const s = createScheduler(lines);

  const shortestFirst = Scheduler.strategy.SJF(s);
  const prioritized = Scheduler.strategy.Priority(s);

  console.log('Shortest First');
  console.dir(shortestFirst);
  printSchedule(shortestFirst);

  console.log('\nPriority Based');
  console.dir(prioritized);
  printSchedule(prioritized);
};

main();
