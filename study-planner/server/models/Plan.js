import mongoose from 'mongoose';

const planSchema = mongoose.Schema(
  {
    goalName: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    dailyHours: {
      type: Number,
      required: true,
    },
    topics: [
      {
        id: String,
        name: String,
        priority: String,
      },
    ],
    learningStyle: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    schedule: [
      {
        day: Number,
        date: String,
        theme: String,
        tasks: [
          {
            type: { type: String },
            topic: String,
            duration: String,
          },
        ],
      },
    ],
    completedTasks: {
      type: [String],
      default: [],
    },
    progress: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

planSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

planSchema.set('toJSON', {
  virtuals: true,
});

const Plan = mongoose.model('Plan', planSchema);

export default Plan;
