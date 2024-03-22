-- AddForeignKey
ALTER TABLE "EventSynced" ADD CONSTRAINT "EventSynced_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "Credential"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
