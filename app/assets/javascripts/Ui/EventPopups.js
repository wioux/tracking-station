
EventPopups = function(system, parent) {
  system.eachBody(function(body) {
    body.timeline.forEach(function(event) {
      system.clock.on(event.jd, function(forward) {
        if (forward) {
          $(".timeline-events [data-event_id="+event.id+"]")
            .addClass("transpired pulse-background")
            .find(".description").addClass("pulse");
        } else {
          $(".timeline-events [data-event_id="+event.id+"]")
            .removeClass("transpired pulse-background")
            .find(".description").removeClass("pulse");
        }
      });
    });
  });
}
