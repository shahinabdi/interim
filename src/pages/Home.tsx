// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { mockJobs, mockCompanies } from '../mock/mockData';
import { JobType, Job } from '../types';
import SearchableDropdown from '../components/ui/SearchableDropdown';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const HeroSection = styled.section`
  padding: ${({ theme }) => `${theme.spacing.xxl} ${theme.spacing.lg}`};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primaryHover});
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='rgba(255,255,255,0.05)' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.3;
  }
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  position: relative;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
  opacity: 0.9;
  position: relative;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const SearchForm = styled(Card)`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  margin-top: -30px;
`;

const SearchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  position: relative;
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 3px;
  }
`;

const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const JobCard = styled(Card)`
  transition: transform ${({ theme }) => theme.transitions.medium}, box-shadow ${({ theme }) => theme.transitions.medium};
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const JobCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.md};
`;

const CompanyLogo = styled.img`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  object-fit: cover;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const JobTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin: 0;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const CompanyName = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const JobLocation = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const JobTypeTag = styled.span<{ jobType: JobType }>`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: 20px;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  
  ${({ jobType, theme }) => {
    switch (jobType) {
      case JobType.FULL_TIME:
        return `
          background-color: ${theme.colors.successLight};
          color: ${theme.colors.success};
        `;
      case JobType.PART_TIME:
        return `
          background-color: ${theme.colors.infoLight};
          color: ${theme.colors.info};
        `;
      case JobType.CONTRACT:
        return `
          background-color: ${theme.colors.warningLight};
          color: ${theme.colors.warning};
        `;
      case JobType.TEMPORARY:
        return `
          background-color: ${theme.colors.primaryFocus};
          color: ${theme.colors.primary};
        `;
      default:
        return `
          background-color: ${theme.colors.surfaceHighlight};
          color: ${theme.colors.textSecondary};
        `;
    }
  }}
`;

const JobDescription = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-grow: 1;
`;

const BulletPoints = styled.ul`
  padding-left: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.xs} 0;
`;

const BulletPoint = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ResultsInfo = styled.div`
  text-align: center;
  margin: ${({ theme }) => theme.spacing.md} 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const Home: React.FC = () => {
  const navigate = useNavigate();
  
  // Filter states
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    jobType: '',
    industry: ''
  });

  // Job data states
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs.slice(0, 6));
  const [allFilteredJobs, setAllFilteredJobs] = useState<Job[]>(mockJobs);
  
  // Dropdown options
  const jobTypeOptions = [
    { value: '', label: 'Tous les types de contrat' },
    { value: JobType.FULL_TIME, label: 'CDI' },
    { value: JobType.CONTRACT, label: 'CDD' },
    { value: JobType.TEMPORARY, label: 'Intérim' },
    { value: JobType.PART_TIME, label: 'Temps partiel' },
    { value: JobType.INTERNSHIP, label: 'Stage' }
  ];
  
  // Generate location options from mock data
  const locationOptions = [
    { value: '', label: 'Toutes les villes' },
    ...Array.from(new Set(mockJobs.map(job => job.location.split(',')[0].trim())))
      .map(location => ({
        value: location,
        label: location
      }))
  ];
  
  // Generate industry options from mock data
  const industryOptions = [
    { value: '', label: 'Tous les secteurs' },
    ...Array.from(new Set(mockCompanies.map(company => company.industry)))
      .map(industry => ({
        value: industry,
        label: industry
      }))
  ];
  
  // Update filters
  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Filter jobs when filters change
  useEffect(() => {
    let results = mockJobs;
    
    // Filter by keyword
    if (filters.keyword.trim()) {
      const keyword = filters.keyword.toLowerCase();
      results = results.filter(job => 
        job.title.toLowerCase().includes(keyword) || 
        job.description.toLowerCase().includes(keyword) ||
        job.company.name.toLowerCase().includes(keyword) ||
        job.requirements.some(req => req.toLowerCase().includes(keyword))
      );
    }
    
    // Filter by location
    if (filters.location) {
      results = results.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    // Filter by job type
    if (filters.jobType) {
      results = results.filter(job => job.type === filters.jobType);
    }
    
    // Filter by industry
    if (filters.industry) {
      results = results.filter(job => 
        job.company.industry.toLowerCase() === filters.industry.toLowerCase()
      );
    }
    
    // Update filtered jobs
    setAllFilteredJobs(results);
    setFilteredJobs(results.slice(0, 6)); // Display only first 6 jobs on homepage
  }, [filters]);
  
  // Navigate to jobs page with filters
  const handleSearchSubmit = () => {
    const params = new URLSearchParams();
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.location) params.append('location', filters.location);
    if (filters.jobType) params.append('jobType', filters.jobType);
    if (filters.industry) params.append('industry', filters.industry);
    
    navigate({
      pathname: '/jobs',
      search: params.toString()
    });
  };

  // Helper function to get job type label
  const getJobTypeLabel = (type: JobType) => {
    switch (type) {
      case JobType.FULL_TIME:
        return 'CDI';
      case JobType.PART_TIME:
        return 'Temps partiel';
      case JobType.CONTRACT:
        return 'CDD';
      case JobType.TEMPORARY:
        return 'Intérim';
      case JobType.INTERNSHIP:
        return 'Stage';
      default:
        return type;
    }
  };

  return (
    <>
      <HeroSection>
        <HeroTitle>Trouvez votre prochain emploi intérimaire</HeroTitle>
        <HeroSubtitle>
          Accédez à des milliers d'offres d'emploi intérimaires dans tous les secteurs et partout en France.
        </HeroSubtitle>
      </HeroSection>
      
      <SearchForm elevation="md">
        <SearchGrid>
          <SearchableDropdown
            options={[]}
            placeholder="Titre du poste, compétences ou entreprise"
            value={filters.keyword}
            onChange={(value) => handleFilterChange('keyword', value)}
            onSearch={(term) => handleFilterChange('keyword', term)}
            label="Recherche"
          />
          
          <SearchableDropdown
            options={locationOptions}
            placeholder="Ville ou région"
            value={filters.location}
            onChange={(value) => handleFilterChange('location', value)}
            label="Localisation"
          />
          
          <SearchableDropdown
            options={jobTypeOptions}
            placeholder="Type de contrat"
            value={filters.jobType}
            onChange={(value) => handleFilterChange('jobType', value)}
            label="Type de contrat"
          />
          
          <SearchableDropdown
            options={industryOptions}
            placeholder="Secteur d'activité"
            value={filters.industry}
            onChange={(value) => handleFilterChange('industry', value)}
            label="Secteur"
          />
        </SearchGrid>
        
        <Button 
          onClick={handleSearchSubmit}
          fullWidth
        >
          Rechercher
        </Button>
      </SearchForm>

      <SectionTitle>Offres d'emploi récentes</SectionTitle>
      
      <JobsGrid>
        {filteredJobs.map(job => (
          <JobCard key={job.id} elevation="sm">
            <JobCardHeader>
              <CompanyLogo src={job.company.logo || 'https://placehold.co/48'} alt={job.company.name} />
              <div>
                <JobTitle>{job.title}</JobTitle>
                <CompanyName>{job.company.name}</CompanyName>
              </div>
            </JobCardHeader>
            
            <JobLocation>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
              </svg>
              {job.location}
            </JobLocation>
            
            <TagsContainer>
              <JobTypeTag jobType={job.type}>
                {getJobTypeLabel(job.type)}
              </JobTypeTag>
            </TagsContainer>
            
            <JobDescription>
              <BulletPoints>
                {job.type === JobType.FULL_TIME && (
                  <>
                    <BulletPoint>Poste à temps plein en CDI</BulletPoint>
                    <BulletPoint>Expérience avec {job.title.includes('Frontend') ? 'React et TypeScript' : job.title.includes('Backend') ? 'Node.js et Express' : 'Python et Data Analysis'}</BulletPoint>
                    <BulletPoint>Travail au sein d'une équipe dynamique</BulletPoint>
                  </>
                )}
                {job.type === JobType.CONTRACT && (
                  <>
                    <BulletPoint>Contrat à durée déterminée (CDD)</BulletPoint>
                    <BulletPoint>Expérience avec les technologies requises</BulletPoint>
                    <BulletPoint>Projets innovants et stimulants</BulletPoint>
                  </>
                )}
                {job.type === JobType.TEMPORARY && (
                  <>
                    <BulletPoint>Mission d'intérim de 3 à 6 mois</BulletPoint>
                    <BulletPoint>Compétences en {job.title.split(' ')[0]}</BulletPoint>
                    <BulletPoint>Possibilité de prolongation</BulletPoint>
                  </>
                )}
                {(job.type === JobType.PART_TIME || job.type === JobType.INTERNSHIP) && (
                  <>
                    <BulletPoint>Travail flexible et adapté</BulletPoint>
                    <BulletPoint>Formation et mentorat inclus</BulletPoint>
                    <BulletPoint>Environnement de travail stimulant</BulletPoint>
                  </>
                )}
              </BulletPoints>
            </JobDescription>
            
            <Button 
              variant="outline" 
              onClick={() => navigate(`/jobs/${job.id}`)}
              fullWidth
            >
              Voir l'offre
            </Button>
          </JobCard>
        ))}
      </JobsGrid>
      
      <ResultsInfo>
        {allFilteredJobs.length > 6 ? (
          <Button 
            variant="text" 
            onClick={handleSearchSubmit}
          >
            Voir les {allFilteredJobs.length} offres d'emploi disponibles
          </Button>
        ) : allFilteredJobs.length > 0 ? (
          `${allFilteredJobs.length} offre(s) trouvée(s)`
        ) : (
          "Aucune offre ne correspond à vos critères"
        )}
      </ResultsInfo>
    </>
  );
};

export default Home;