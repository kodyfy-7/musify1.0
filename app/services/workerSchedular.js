const { Worker } = require('bull');
const { Sequelize, Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { assignParticipantsToCohortQueue } = require('../../config/queueConnection'); // Adjust the path as necessary
const Participant = require('../../models/Participant');
const CohortParticipant = require('../../models/CohortParticipant');
const User = require('../../models/User');
const RolePermissionService = require('../services/RolePermissionService')

// Initialize Sequelize
const sequelize = new Sequelize({
  // Your Sequelize config
});

// Worker to process participant assignment jobs
const worker = new Worker('assignParticipantsToCohortQueue', async job => {
  const { orgId, cohortId, participants } = job.data;

  await sequelize.transaction(async t => {
    try {
      const accountType = 'participant';
      const role = await RolePermissionService.getARoleBySlug(accountType);
      const roleId = role.id;
          
      await Promise.all(participants.map(async newParticipant => {
        const password = '12345678'; // Replace with your password generation logic
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const [user, created] = await User.findOrCreate({
          where: {
            [Op.or]: [
              { email: newParticipant.email },
              { employeeId: newParticipant.email }
            ]
          },
          defaults: {
            name: newParticipant.name,
            organizationId: orgId,
            email: newParticipant.email,
            employeeId: newParticipant.employeeId,
            emailVerifiedAt: new Date(),
            password: hashedPassword,
            roleId
          },
          transaction: t,
        });

        if (created) {
          // Create user document in Firestore or any other service
        //   await db.collection('users').doc(user.id.toString()).set({
        //     name: newParticipant.name,
        //     organizationId: orgId,
        //     email: newParticipant.email,
        //     employeeId: newParticipant.employeeId,
        //     emailVerifiedAt: new Date(),
        //     roleId
        //   });
        }

        const [participant, participantCreated] = await Participant.findOrCreate({
          where: { userId: user.id },
          defaults: {
            userId: user.id,
            organizationId: orgId,
          },
          transaction: t,
        });

        if (participantCreated) {
          // Create participant document in Firestore or any other service
        //   await db.collection('participants').doc(participant.id.toString()).set({
        //     userId: user.id.toString(),
        //     organizationId: orgId,
        //     participantId: participant.id.toString()
        //   });
        }

        const [cohortParticipant, cohortParticipantCreated] = await CohortParticipant.findOrCreate({
          where: {
            cohortId: cohortId,
            participantId: participant.id
          },
          defaults: {
            cohortId: cohortId,
            participantId: participant.id
          },
          transaction: t,
        });

        if (cohortParticipantCreated) {
          // Create cohortParticipant document in Firestore or any other service
        //   await db.collection('cohortParticipants').doc(cohortParticipant.id.toString()).set({
        //     cohortId: cohortId,
        //     participantId: participant.id.toString(),
        //     cohortParticipantId: cohortParticipant.id
        //   });
        }
      }));

      return { success: true, message: 'Participants assigned to cohort successfully.' };
    } catch (error) {
      throw new Error(`Participant could not be assigned: ${error.message}`);
    }
  });
});
