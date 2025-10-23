type BadgeVariant =
	| 'default'
	| 'secondary'
	| 'success'
	| 'warning'
	| 'danger'
	| 'info'
	| 'outline'
	| 'outline-danger'
	| 'outline-success'
	| 'outline-warning'
	| 'outline-info'
	| 'lite-success'
	| 'lite-warning'
	| 'lite-danger'
	| 'lite-info';

export const getStatusVariant = (status?: string): BadgeVariant => {
	if (!status) return 'secondary';
	const lowerCaseStatus = status.toLowerCase();

	switch (lowerCaseStatus) {
		// Success states
		case 'published':
		case 'hired':
		case 'completed':
			return 'success';

		case 'active':
		case 'approved':
		case 'accepted':
			return 'lite-success';

		// Secondary states
		case 'draft':
		case 'archived':
		case 'inactive':
			return 'secondary';

		// Success states - Outline variant
		case 'verified':
		case 'confirmed':
			return 'outline-success';

		// Warning states - Outline variant
		case 'on-hold':
		case 'awaiting':
			return 'outline-warning';

		// Info states - Outline variant
		case 'applied':
		case 'reviewing':
		case 'in-review':
			return 'outline-info';

		// Warning/Pending states - Lite variant
		case 'pending':
		case 'shortlisted':
		case 'interview':
		case 'exam':
			return 'lite-warning';

		// Info/Progress states - Lite variant
		case 'in-progress':
		case 'processing':
			return 'lite-info';

		// Danger/Negative states
		case 'rejected':
		case 'cancelled':
		case 'failed':
		case 'expired':
			return 'outline-danger';

		case 'declined':
		case 'disqualified':
		case 'terminated':
			return 'danger';

		// Default fallback
		default:
			return 'outline';
	}
};
