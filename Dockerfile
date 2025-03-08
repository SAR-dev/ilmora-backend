FROM ghcr.io/muchobien/pocketbase:0.25

# Set working directory
WORKDIR /

# Expose the PocketBase port
EXPOSE 8090

# Copy necessary volumes
COPY ./pb_data /pb_data
# COPY ./pb_public /pb_public
COPY ./pb_hooks /pb_hooks
COPY ./pb_migrations /pb_migrations

# Define health check
HEALTHCHECK --interval=5s --timeout=5s --retries=5 CMD wget --no-verbose --tries=1 --spider http://localhost:8090/api/health || exit 1

# Command to run PocketBase
CMD ["--encryptionEnv", "ENCRYPTION"]
