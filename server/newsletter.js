FutureTasks = new Meteor.Collection('future_tasks');

// In this case, "details" should be an object containing a date, plus required e-mail details (recipient, content, etc.)
Meteor.methods({
 sendNewsletter: function(data) {

	// Email.send({
	// 	from: details.from,
	//         to: details.to,
  //       	etc....
	// });

  },
  addTask: function(id, data) {

  	// SyncedCron.add({
  	// 	name: id,
  	// 	schedule: function(parser) {
  	// 		return parser.recur().on(details.date).fullDate();
  	// 	},
  	// 	job: function() {
  	// 		sendMail(details);
  	// 		FutureTasks.remove(id);
  	// 		SyncedCron.remove(id);
  	//         	return id;
  	// 	}
  	// });

  },
  scheduleNewsletter(data) {

  	// if (details.date < new Date()) {
  	// 	sendMail(details);
  	// } else {
  	// 	var thisId = FutureTasks.insert(details);
  	// 	addTask(thisId, details);
  	// }
  	// return true;
  }
});


Meteor.startup(function() {

	// FutureTasks.find().forEach(function(newsletter) {
	// 	if (newsletter.date < new Date()) {
	// 		sendMail(newsletter)
	// 	} else {
	// 		addTask(mail._id, newsletter);
	// 	}
	// });
	// SyncedCron.start();


});
