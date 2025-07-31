// seed/doctors.seed.ts

import db from './db';
import { userTable, doctorsTable } from './schema';
import { eq } from 'drizzle-orm';

async function seedDoctors() {
  try {
    console.log('🌱 Seeding doctors...');

    const doctors = [
      {
        user: {
          firstName: 'Emily',
          lastName: 'Ngugi',
          email: 'emily.ngugi@aura.com',
          password: 'hashed-password-1', // Replace with hashed password
          contactPhone: '0712345678',
          address: 'Nairobi',
          userType: 'doctor' as const,
        },
        doctor: {
          specialization: 'Cardiologist',
          contactPhone: '0712345678',
          isAvailable: true,
          defaultSlotDuration: 30,
        },
      },
      {
        user: {
          firstName: 'John',
          lastName: 'Omondi',
          email: 'john.omondi@aura.com',
          password: 'hashed-password-2',
          contactPhone: '0722334455',
          address: 'Kisumu',
          userType: 'doctor' as const,
        },
        doctor: {
          specialization: 'Dermatologist',
          contactPhone: '0722334455',
          isAvailable: true,
          defaultSlotDuration: 30,
        },
      },
      {
        user: {
          firstName: 'Sarah',
          lastName: 'Kiprono',
          email: 'sarah.kiprono@aura.com',
          password: 'hashed-password-3',
          contactPhone: '0733445566',
          address: 'Eldoret',
          userType: 'doctor' as const,
        },
        doctor: {
          specialization: 'Pediatrician',
          contactPhone: '0733445566',
          isAvailable: false,
          defaultSlotDuration: 20,
        },
      },
    ];

    for (const entry of doctors) {
      // Check if user exists
      const [existingUser] = await db
        .select()
        .from(userTable)
        .where(eq(userTable.email, entry.user.email));

      let userId: number;

      if (existingUser) {
        console.log(`⚠️  User already exists: ${entry.user.email}`);
        userId = existingUser.userId;
      } else {
        const inserted = await db.insert(userTable).values(entry.user).returning({ userId: userTable.userId });
        userId = inserted[0].userId;
        console.log(`✅ Created user for ${entry.user.firstName} (${userId})`);
      }

      // Check if doctor already exists
      const [existingDoctor] = await db
        .select()
        .from(doctorsTable)
        .where(eq(doctorsTable.userId, userId));

      if (existingDoctor) {
        console.log(`⚠️  Doctor already exists for userId ${userId}`);
        continue;
      }

      await db.insert(doctorsTable).values({
        ...entry.doctor,
        userId,
        firstName: entry.user.firstName,
        lastName: entry.user.lastName,
      });

      console.log(`✅ Inserted doctor: Dr. ${entry.user.firstName} ${entry.user.lastName}`);
    }

    console.log('✅ Doctor seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed doctors:', error);
    process.exit(1);
  }
}

seedDoctors();
