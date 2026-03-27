export function validateEvent(req, res, next) {
  const { title, category, location, startTime, organizer, maxParticipants } = req.body;
  const errors = [];

  if (!title || title.trim() === '') errors.push('活动名称不能为空');
  if (!category) errors.push('活动类别不能为空');
  if (!location || !location.name || location.name.trim() === '') errors.push('活动地点名称不能为空');
  if (!location || location.lat === undefined || location.lat === null) errors.push('活动地点纬度不能为空');
  if (!location || location.lng === undefined || location.lng === null) errors.push('活动地点经度不能为空');
  if (!startTime) {
    errors.push('开始时间不能为空');
  } else if (new Date(startTime) <= new Date()) {
    errors.push('开始时间必须是将来的时间');
  }
  if (!organizer || organizer.trim() === '') errors.push('发起人不能为空');
  if (maxParticipants !== undefined && (maxParticipants < 1 || maxParticipants > 200)) {
    errors.push('最大参与人数必须在1到200之间');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  if (!req.body.maxParticipants) req.body.maxParticipants = 20;
  next();
}
