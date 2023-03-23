export const DEFAULT_AVATARS_BUCKET = 'avatars';

export type Profile = {
	id?: string;
	avatar_url: string;
	username: string;
	website: string;
	updated_at?: string;
};

export const settingsNavigationData = [
	{
		name: 'My Details',
		children: [
			{
				name: 'Profile',
				url: '/profile',
			},
		],
	},
	{
		name: 'Wishes',
		children: [
			{
				name: 'Wish',
				url: '/wish',
			},
		],
	},
	{
		name: 'Projects',
	},
];
