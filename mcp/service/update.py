import fooster.cron

import mcp.model.source

scheduler = None

def update():
    for source in mcp.model.source.items():
        mcp.model.source.update(source.source)

def start():
    global scheduler

    if scheduler:
        return

    scheduler = fooster.cron.Scheduler()
    scheduler.add(fooster.cron.Job(update, minute=0))
    scheduler.start()

def stop():
    global scheduler

    if not scheduler:
        return

    scheduler.stop()
    scheduler = None
