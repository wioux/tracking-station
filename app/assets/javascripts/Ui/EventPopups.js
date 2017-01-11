
EventPopups = function(system, parent) {
  system.eachBody(function(body) {
    body.timeline.forEach(function(event) {
      system.clock.on(event.jd, function(forward) {
        if (forward) {
          $(".timeline-events [data-event_id="+event.id+"]")
            .addClass("transpired")
            .find(".description").addClass("pulse");
        } else {
          $(".timeline-events [data-event_id="+event.id+"]")
            .removeClass("transpired")
            .find(".description").removeClass("pulse");
        }
      });
    });
  });
}
