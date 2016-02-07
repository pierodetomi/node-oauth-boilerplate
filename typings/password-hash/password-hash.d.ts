declare module "password-hash" {
	/**
	 * Generates a hash of the required password argument. Hashing behavior can be modified with the optional options object.
	 * 
	 * @param password The password to hash
	 * @param options The options to modify the hashing behavior
	 * 
	 */
	function generate(password: string, options?: IPasswordHashOptions): string;
	
	/**
	 * Checks the provided password against a password already hashed. Returns a boolean indicating if there is a match.
	 * 
	 * @param password The password to check
	 * @param hashedPassword The hashed password to use as term of comparison
	 */
	function verify(password: string, hashedPassword: string): boolean;
	
	interface IPasswordHashOptions {
		/**
         * A valid cryptographic algorithm for use with the crypto.createHmac function, defaults to 'sha1'
         */
		algorithm: string;
		/**
         * The length of the salt that will be generated when the password is hashed, defaults to 8
         */
		saltLength: number;
		/**
         * The number of times the hashing algorithm should be applied, defaults to 1
         */
		iterations: number;
	}
}